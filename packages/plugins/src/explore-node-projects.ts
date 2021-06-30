import * as fs from 'fs';
import * as path from 'path';
import { tty } from './tty';

const { stdout } = process;

type NodeProjectVisitor = {
  filter(predicate: (uri: string) => boolean): NodeProjectVisitor,
  forEach(visit: (uri: string) => Promise<void>): Promise<void>,
};

export function exploreNodeProjects(...paths: string[]): NodeProjectVisitor {
  tty.test(stdout);

  tty.newLine(stdout, tty.h1(`probe ${paths.length} folder(s)`));
  paths.forEach(path => tty.newLine(stdout, tty.h2(path)));

  const projectFolders = paths
    .map(cwd => walk(cwd))
    .reduce((memo, folders) => {
      memo.push(...folders);
      return memo;
    }, []);

  tty.newLine(stdout, tty.h1(`found ${projectFolders.length} package(s)`));

  let matchedProjectFolders = Array.from(projectFolders);
  const visitor: NodeProjectVisitor = {
    filter: predicate => {
      matchedProjectFolders = matchedProjectFolders.filter(predicate);


      return visitor;
    },
    forEach: visit => {

      projectFolders.forEach(folder =>
        matchedProjectFolders.includes(folder)
          ? tty.newLine(stdout, tty.h2(folder))
          : tty.newLine(stdout, tty.h2(folder), ' - ', tty.warn('skipped'))
      );

      return matchedProjectFolders
        .reduce(
          (memo, uri) => memo.then(() => visit(uri)),
          Promise.resolve()
        );
    }
  };

  return visitor;
}

function likePackage(dir: string) {
  return fs.existsSync(path.join(dir, 'features'));
}

function walk(directory: string, folders: string[] = []): string[] {
  if (likePackage(directory)) {
    folders.push(directory);
    return folders;
  }

  const items = fs.readdirSync(directory);
  for (const item of items) {
    const itemPath = path.join(directory, item);
    if (fs.statSync(itemPath).isDirectory()) {
      walk(itemPath, folders);
    }
  }

  return folders;
}
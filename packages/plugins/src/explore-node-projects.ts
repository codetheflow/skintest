import * as fs from 'fs';
import * as path from 'path';
import { tty } from './tty';

const { stdout } = process;

type NodeProjectVisitor = {
  filter(predicate: (uri: string) => boolean): NodeProjectVisitor,
  forEach(visit: (uri: string) => Promise<void>): Promise<void>,
};

export function exploreNodeProjects(...paths: string[]): NodeProjectVisitor {
  tty.newLine(stdout, tty.h1(`probe ${paths.length} folder(s)`));
  paths.forEach(path => tty.newLine(stdout, tty.h2(path)));

  const projectFolders = paths
    .map(cwd =>
      fs
        .readdirSync(cwd, { withFileTypes: true })
        .filter(dir => dir.isDirectory())
        .map(dir => path.join(cwd, dir.name))
        .concat([cwd])
        .filter(likeProject)
    )
    .reduce((memo, folders) => {
      memo.push(...folders);
      return folders;
    }, []);

  let matchedProjectFolders = Array.from(projectFolders);

  tty.newLine(stdout, tty.h1(`found ${projectFolders.length} package(s)`));

  const visitor: NodeProjectVisitor = {
    filter: predicate => {
      matchedProjectFolders = matchedProjectFolders.filter(predicate);
      projectFolders.forEach(folder =>
        matchedProjectFolders.includes(folder)
          ? tty.newLine(stdout, tty.h2(folder))
          : tty.newLine(stdout, tty.h2(folder), ' - ', tty.warn('skipped'))
      );

      return visitor;
    },
    forEach: visit => {
      return matchedProjectFolders
        .reduce(
          (memo, uri) => memo.then(() => visit(uri)),
          Promise.resolve()
        );
    }
  };

  return visitor;
}

function likeProject(dir: string) {
  return fs.existsSync(path.join(dir, 'features'));
}
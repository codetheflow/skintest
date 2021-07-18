import * as fs from 'fs';
import * as path from 'path';

type NodeProjectVisitor = {
  filter(predicate: (uri: string) => boolean): NodeProjectVisitor,
  forEach(visit: (uri: string) => Promise<void>): Promise<void>,
};

export function exploreNodeProjects(...paths: string[]): NodeProjectVisitor {
  const projectFolders = paths
    .map(cwd => walk(cwd))
    .reduce((memo, folders) => {
      memo.push(...folders);
      return memo;
    }, []);

  let matchedProjectFolders = Array.from(projectFolders);
  const visitor: NodeProjectVisitor = {
    filter: predicate => {
      matchedProjectFolders = matchedProjectFolders.filter(predicate);
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
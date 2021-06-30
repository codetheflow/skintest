import * as fs from 'fs';
import * as path from 'path';

type NodeProjectVisitor = {
  filter: (predicate: (uri: string) => boolean) => NodeProjectVisitor;
  forEach: (visit: (uri: string) => Promise<void>) => Promise<void>;
};

export function exploreNodeProjects(...paths: string[]): NodeProjectVisitor {
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

function likeProject(dir: string) {
  return fs.existsSync(path.join(dir, 'features'));
}
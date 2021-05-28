import * as fs from 'fs';
import * as path from 'path';

type NodeProjectVisitor = {
  forEach: (visit: (uri: string) => Promise<void>) => Promise<void>;
};

export function exploreNodeProjects(cwd: string): NodeProjectVisitor {
  const sites = fs
    .readdirSync(cwd, { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .map(dir => path.join(cwd, dir.name))
    .concat([cwd])
    .filter(likeProject);

  return {
    forEach: visit => sites.reduce((memo, uri) => memo.then(() => visit(uri)), Promise.resolve())
  };
}

function likeProject(dir: string) {
  return fs.existsSync(path.join(dir, 'features'));
}
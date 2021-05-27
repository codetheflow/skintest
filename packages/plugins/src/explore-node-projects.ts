import * as fs from 'fs';
import * as path from 'path';

export type NodeProjectSite = {
  path: string;
};

type NodeProjectVisitor = {
  forEach: (visit: (site: NodeProjectSite) => Promise<void>) => void;
};

function likeProject(dir: string) {
  return fs.existsSync(path.join(dir, 'features'));
}

export function exploreNodeProjects(cwd: string): NodeProjectVisitor {
  const sites = fs
    .readdirSync(cwd, { withFileTypes: true })
    .filter(dir => dir.isDirectory() && likeProject(path.join(cwd, dir.name)))
    .map(dir => ({ path: path.join(cwd, dir.name) }));

  return {
    forEach: visit => {
      sites.reduce((memo, site) => memo.then(() => visit(site)), Promise.resolve());
    },
  };
}
import * as fs from 'fs';
import * as path from 'path';

type NodeProjectVisitor = {
  filter: (predicate: (uri: string) => boolean) => NodeProjectVisitor;
  forEach: (visit: (uri: string) => Promise<void>) => Promise<void>;
};

export function exploreNodeProjects(cwd: string): NodeProjectVisitor {
  const sites = fs
    .readdirSync(cwd, { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .map(dir => path.join(cwd, dir.name))
    .concat([cwd])
    .filter(likeProject);

  let filterSites = Array.from(sites);

  const visitor: NodeProjectVisitor = {
    filter: predicate => {
      filterSites = filterSites.filter(predicate);
      return visitor;
    },
    forEach: visit => {
      return filterSites
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
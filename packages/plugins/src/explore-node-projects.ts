import * as fs from 'fs';
import * as path from 'path';

export type NodeProjectSite = {
  name: string;
  featuresPath: string;
};

export function exploreNodeProjects(cwd: string): Array<NodeProjectSite> {
  return fs
    .readdirSync(cwd, { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .map(dir => ({
      name: dir.name,
      featuresPath: path.join(cwd, dir.name, 'features'),
    }))
    .filter(({ featuresPath }) => fs.existsSync(featuresPath));
}
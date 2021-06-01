import * as path from 'path';

// const base_url = 'https://qgrid.github.io/ng2/';
const base_url = 'http://localhost:4200/';
const base_path = process.cwd();
const output_path = path.join(base_path, 'output');

export const env = {
  base_url
  , export_url: `${base_url}export-basic`

  , base_path
  , output_path
  , downloads_path: path.join(output_path, 'downloads')
};
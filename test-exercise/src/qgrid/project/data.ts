import * as path from 'path';

const base_path = process.cwd();
const output_path = path.join(base_path, 'output');
const data_path = path.join(base_path, 'exercise', 'src', 'qgrid', 'data');
const downloads_path = path.join(output_path, 'downloads');

export const data = {
  base_path

  , downloads_path
  , atoms_csv_path: path.join(data_path, 'atoms.csv')
};
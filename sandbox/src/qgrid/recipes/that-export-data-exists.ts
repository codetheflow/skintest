import { recipe } from '@skintest/sdk';
import * as fs from 'fs';
import { env } from '../project/env';
import path = require('path');

export const that_export_data_exists = recipe.assert(
  /**
   * assert that file is not empty
   * 
   * @param file_name name of the file
   * @returns data exists assert recipe
   */
  async function (file_name: string) {
    const { pass, fail } = this;

    const path_to_file = path.join(env.downloads_path, file_name);
    if (fs.existsSync(path_to_file)) {
      return pass();
    }

    return fail(`${path_to_file} doesn't contain data`);
  }
);
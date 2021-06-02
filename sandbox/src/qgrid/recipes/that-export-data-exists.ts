import { recipe } from '@skintest/sdk';
import * as fs from 'fs';

export const that_export_data_exists = recipe.assert(
  /**
   * assert that file is not empty
   * 
   * @param file_path path to the file
   * @returns data exists assert recipe
   */
  async function (file_path: string) {
    const { pass, fail } = this;
    
    if (fs.existsSync(file_path)) {
      const { size } = fs.statSync(file_path);
      if (size > 0) {
        return pass();
      }

      return fail(`\`${file_path}\` doesn't contain data`)
    }

    return fail(`\`${file_path}\` doesn't exist`);
  }
);
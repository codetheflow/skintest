import { fail, pass, TestResult } from '@skintest/sdk';
import * as fs from 'fs';
import * as path from 'path';
import { data } from '../project/data';

/**
 * assert that file is not empty
 * 
 * @param file_name name of the file
 * @returns assertion
 */
export async function that_data_exists(file_name: string): Promise<TestResult> {
  const file_path = path.join(data.downloads_path, file_name);

  if (fs.existsSync(file_path)) {
    const { size } = fs.statSync(file_path);
    if (size > 0) {
      return pass();
    }

    return fail.reason({
      description: `\`${file_path}\` doesn't contain data`,
      solution: 'make sure that data source is correct'
    });
  }

  // todo: use levenshtein distance to suggest file paths
  return fail.reason({
    description: `\`${file_path}\` doesn't exist`,
    solution: 'make sure that file path is correct'
  });
}
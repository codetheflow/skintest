import { fail, pass, TestResult } from '@skintest/sdk';
import * as fs from 'fs';

/**
 * assert that file is not empty
 * 
 * @param file_path path to the file
 * @returns assertion
 */
export async function that_data_exists(file_path: string): Promise<TestResult> {
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
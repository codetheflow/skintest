/* eslint-disable @typescript-eslint/no-non-null-assertion */

import * as path from 'path';
import * as StackUtils from 'stack-utils';

const su = new StackUtils();

export function parseStack(stack: string): StackFrame[] {
  const frames: StackFrame[] = [];
  for (const line of stack.split('\n')) {
    const frame = su.parseLine(line);
    if (!frame || !frame.file) {
      continue;
    }

    if (frame.file.startsWith('internal')) {
      continue;
    }

    const fileName = path.resolve(process.cwd(), frame.file);
    frames.push({
      file: fileName,
      line: frame.line!,
      column: frame.column!,
      function: frame.function!,
    });
  }

  return frames;
}

export type StackFrame = {
  file: string,
  line: number,
  column: number,
  function: string,
};

export function capture(): StackFrame[] {
  const stack = new Error().stack || '';
  return parseStack(stack);
}

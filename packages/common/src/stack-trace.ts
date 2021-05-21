import * as path from 'path';
import * as StackUtils from 'stack-utils';

const su = new StackUtils();

export function prettyStack(stack: string): string {
  return su.clean(stack);
}

export type StackFrame = {
  file: string,
  line: number,
  column: number,
  function: string,
};

export function capture(ignore: string[]): StackFrame[] {
  const stack = new Error().stack || '';
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
    if (ignore.some(x => fileName.includes(x))) {
      continue;
    }

    frames.push({
      file: fileName,
      line: frame.line!,
      column: frame.column!,
      function: frame.function!,
    });
  }

  return frames;
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import * as fs from 'fs';
import * as path from 'path';
import { MappedPosition, SourceMapConsumer } from 'source-map';
import * as StackUtils from 'stack-utils';
import { callerNotFoundError } from './errors';

const su = new StackUtils();
const CWD = process.cwd();

export function parseStack(stack: string): StackFrame[] {
  // todo: map to ts files where possible
  const frames: StackFrame[] = [];
  for (const line of stack.split('\n')) {
    const frame = su.parseLine(line);
    if (!frame || !frame.file) {
      continue;
    }

    if (frame.file.startsWith('internal')) {
      continue;
    }

    const fileName = path.resolve(CWD, frame.file);

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
  function?: string,
};

export function capture(): StackFrame[] {
  const stack = new Error().stack || '';
  return parseStack(stack);
}

export function withSourceMap(caller: StackFrame): Promise<StackFrame> {
  const sourceMap = fs.readFileSync(caller.file + '.map').toString();
  
  return SourceMapConsumer.with(sourceMap, null, consumer => {
    const pos = consumer.originalPositionFor(caller) as MappedPosition;
    if (!pos) {
      throw callerNotFoundError('source-map');
    }

    return {
      file: path.resolve(caller.file, '../' + pos.source),
      ...pos
    }
  });
}
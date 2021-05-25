/* eslint-disable @typescript-eslint/no-non-null-assertion */

import * as fs from 'fs';
import * as path from 'path';
import { MappedPosition, SourceMapConsumer } from 'source-map';
import * as StackUtils from 'stack-utils';
import { errors } from './errors';
import { isUndefined } from './utils';

const su = new StackUtils();
const CWD = process.cwd();

function goodFrame(frame: StackFrame | null) {
  return frame
    && frame.file
    && !isUndefined(frame.line)
    && !isUndefined(frame.column);
}

export async function prettyStack(stack: string): Promise<StackFrame[]> {
  const frames = parseStack(stack);
  const prettyFrames: StackFrame[] = [];
  for (const frame of frames) {
    try {
      const prettyFrame = await withSourceMap(frame);
      prettyFrames.push(prettyFrame);
    } catch {
      prettyFrames.push(frame);
    }
  }

  return prettyFrames;
}

function parseStack(stack: string): StackFrame[] {
  const frames: StackFrame[] = [];
  for (const line of stack.split('\n')) {
    const frame = su.parseLine(line) as StackFrame;
    if (!goodFrame(frame)) {
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
    if (!pos || !pos.source) {
      throw errors.callerNotFound('source-map');
    }

    return {
      ...caller,
      ...pos,
      file: path.resolve(caller.file, '../' + pos.source),
    };
  });
}
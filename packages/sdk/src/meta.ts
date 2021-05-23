import { callerNotFoundError, capture, StackFrame, withSourceMap } from '@skintest/common';
import * as fs from 'fs';
import * as path from 'path';

const PACKAGES = [
  'common',
  'sdk',
  'plugins',
  'platform'
].map(x => path.sep + path.join(x, 'dist'));

export type Meta = Omit<StackFrame, 'function'>;
export type StepMeta = Meta & { rootage: string };

export async function getStepMeta(caller: StackFrame): Promise<StepMeta> {
  const meta = await getMeta(caller);
  const originContent = fs.readFileSync(meta.file).toString();
  const lines = originContent.split('\n');

  // todo: prettify/parse output
  const rootage = strip(lines[meta.line - 1]);
  return {
    ...meta,
    rootage
  };
}

export function getMeta(caller: StackFrame): Promise<Meta> {
  return withSourceMap(caller);
}

export function getCaller(): StackFrame {
  const frames = capture();
  const callers = frames
    .filter(x => x.file)
    .filter(x => !PACKAGES.some(p => x.file.includes(p)))

  if (!callers.length) {
    throw callerNotFoundError(frames[0]?.file);
  }

  return callers[0];
}

function strip(line: string): string {
  // todo: make it better
  let start = 0;
  let end = line.length - 1;
  while (start <= end) {
    const c = line[start];
    if (c === ' ' || c === ',') {
      start++;
      continue;
    }

    break;
  }

  while (end >= start) {
    const c = line[end];
    if (c === ' ' || c === ',') {
      end--;
      continue;
    }

    break;
  }

  return line.slice(start, end + 1);
}
import { callerNotFoundError, capture, StackFrame } from '@skintest/common';
import * as fs from 'fs';
import * as path from 'path';
import { MappedPosition, SourceMapConsumer } from 'source-map';

const PACKAGES = [
  'common',
  'sdk',
  'plugins',
  'platform'
].map(x => path.sep + path.join(x, 'dist'));

export interface Meta {
  file: string;
  line: number;
  column: number;
}

export interface StepMeta extends Meta {
  file: string;
  line: number;
  column: number;
  code: string;
}

export function getStepMeta(): Promise<StepMeta> {
  const caller = getCaller();
  const callerContent = fs.readFileSync(caller.file + '.map').toString();

  return SourceMapConsumer.with(callerContent, null, consumer => {
    const pos = consumer.originalPositionFor(caller) as MappedPosition;
    if (!pos) {
      throw callerNotFoundError('source map');
    }

    const originFile = path.resolve(path.dirname(caller.file), pos.source);
    const originContent = fs.readFileSync(originFile).toString();
    const lines = originContent.split('\n');

    // todo: prettify/parse output
    const code = strip(lines[pos.line - 1]);
    return {
      file: path.resolve(caller.file, '../' + pos.source),
      ...pos,
      code
    };
  });
}

export function getMeta(): Promise<Meta> {
  const caller = getCaller();
  const callerContent = fs.readFileSync(caller.file + '.map').toString();

  return SourceMapConsumer.with(callerContent, null, consumer => {
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

function getCaller(): StackFrame {
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
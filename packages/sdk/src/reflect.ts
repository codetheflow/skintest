import { callerNotFoundError } from '@skintest/common';
import * as fs from 'fs';
import * as path from 'path';
import { MappedPosition, SourceMapConsumer } from 'source-map';

const FRAME_RE1 = new RegExp(/\((.*):(\d+):(\d+)\)/);
const FRAME_RE2 = new RegExp(/at ([^(]*):(\d+):(\d+)/);

const SDK_DIR = path.dirname(__filename);

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
    const code = trim(lines[pos.line - 1]);
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
    // consumer.sourceContentFor()
    if (!pos) {
      throw callerNotFoundError('source map');
    }

    return {
      file: path.resolve(caller.file, '../' + pos.source),
      ...pos
    }
  });
}

function getCaller(): Omit<StepMeta, 'code'> {
  const site = new Error();
  Error.captureStackTrace(site);

  const frames: string[] = (site.stack || '')
    .split('\n')
    .slice(1);

  for (const frame of frames) {
    if (frame.indexOf(SDK_DIR) < 0) {
      const info1 = FRAME_RE1.exec(frame);
      if (info1) {
        return {
          file: info1[1],
          line: Number(info1[2]),
          column: Number(info1[3]),
        };
      }

      const info2 = FRAME_RE2.exec(frame);
      if (info2) {
        return {
          file: info2[1],
          line: Number(info2[2]),
          column: Number(info2[3]),
        };
      }

      throw callerNotFoundError(frame.trim());
    }
  }

  throw callerNotFoundError((frames[0] || '').trim());
}

function trim(line: string): string {
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
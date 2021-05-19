import * as fs from 'fs';
import * as path from 'path';
import { MappedPosition, SourceMapConsumer } from 'source-map';
import { callerNotFoundError } from '@skintest/common';

const FRAME_RE = new RegExp(/\((.*):(\d+):(\d+)\)/);
const SDK_DIR = path.dirname(__filename);

export type Meta = {
  file: string;
  line: number;
  column: number;
  code: string;
}

function getCaller(): Omit<Meta, 'code'> {
  const site = new Error();
  Error.captureStackTrace(site);

  const frames: string[] = (site as any)
    .stack
    .split('\n')
    .slice(1);

  for (const frame of frames) {
    if (frame.indexOf(SDK_DIR) < 0) {
      const info = FRAME_RE.exec(frame);
      if (!info) {
        throw callerNotFoundError(frame);
      }

      return {
        file: info[1],
        line: Number(info[2]),
        column: Number(info[3]),
      };
    }
  }

  throw callerNotFoundError((site as any).stack);
}

export function getCallerMeta(): Promise<Meta> {
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
    const code = lines[pos.line - 1].trim();
    return {
      ...caller,
      code
    };
  });
}
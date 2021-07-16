import { errors, Guard } from '@skintest/common';

export interface RepeatEntry {
  index: number;
  first: boolean;
  even: boolean;
  odd: boolean;
}

export interface RepeatWrite {
  next(entry: RepeatEntry): void;
}

export interface RepeatRead {
  current(): RepeatEntry;
}

export class RepeatYield implements RepeatRead, RepeatWrite {
  private entry: RepeatEntry | null = null;

  next(entry: RepeatEntry): void {
    Guard.notNull(entry, 'entry');
    this.entry = entry;
  }

  current(): RepeatEntry {
    if (!this.entry) {
      throw errors.invalidOperation('till.yield can be used only in conjunction with till(`message`) step');
    }

    return this.entry as RepeatEntry;
  }
}
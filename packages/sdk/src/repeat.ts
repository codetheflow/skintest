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
  return(): RepeatEntry;
}

export class RepeatYield implements RepeatRead, RepeatWrite {
  private current: RepeatEntry | null = null;

  next(entry: RepeatEntry): void {
    Guard.notNull(entry, 'entry');
    this.current = entry;
  }

  return(): RepeatEntry {
    if(!this.current ) {
      throw errors.constraint('till.yield can be used only in conjunction with till(`message`) step');
    }
    
    return this.current as RepeatEntry;
  }
}
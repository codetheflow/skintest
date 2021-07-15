import { extend } from './extend';


export interface MergeResult {
  updated: number;
  removed: number;
  inserted: number;
}

export interface MergeSettings<T> {
  equals: (l: T, r: T, i: number, j: number) => boolean;
  update: (l: T, r: T, left: T[], i: number) => void;
  remove: (l: T, left: T[], i: number) => void;
  insert: (r: T, left: T[]) => void;
  sort: (a: T, b: T) => number;
}

export function merge<T>(settings: Partial<MergeSettings<T>>): (left: T[], right: T[], result: T[]) => MergeResult {
  const noSort = () => 0;
  const act = extend({
    equals: (l, r) => l === r,
    update: (l, r) => {
      extend(l as Record<string, unknown>, r as Record<string, unknown>);
      return l;
    },
    remove: (l, left, i) => {
      left.splice(i, 1);
      return l;
    },
    insert: (r, left) => {
      left.push(r);
      return r;
    },
    sort: noSort
  }, settings) as MergeSettings<T>;

  return (left: T[], right: T[], result: T[]): MergeResult => {
    const ls = left.slice();
    const rs = right.slice();
    let updated = 0;
    let removed = 0;

    result = result || left;
    for (let i = 0, lsLength = ls.length; i < lsLength; i++) {
      const l = ls[i];
      let matched = false;
      for (let j = 0, rsLength = rs.length; j < rsLength; j++) {
        const r = rs[j];
        if (act.equals(l, r, i, j)) {
          act.update(l, r, result, result.indexOf(l));
          updated++;
          matched = true;
          rs.splice(j, 1);
          break;
        }
      }

      if (!matched) {
        act.remove(l, result, result.indexOf(l));
        removed++;
      }
    }

    const inserted = rs.length;
    for (let i = 0; i < inserted; i++) {
      act.insert(rs[i], result);
    }

    if (act.sort !== noSort) {
      result.sort(act.sort);
    }

    return { updated, removed, inserted };
  };
}
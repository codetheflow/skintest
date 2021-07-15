export class Indexed<T> implements Iterable<[number, T]>, CanAppend<T> {
  constructor(private items: T[] = []) { }

  append(...items: T[]): void {
    this.items.push(...items);
  }

  [Symbol.iterator](): Iterator<[number, T]> {
    let cursor = 0;
    const { items } = this;

    return {
      next(): IteratorResult<[number, T]> {
        if (cursor < items.length) {
          return {
            done: false,
            value: [cursor, items[cursor++]]
          };
        }

        return {
          done: true,
          value: null
        };
      }
    };
  }
}

export interface CanAppend<T> {
  append(...items: T[]): void;
}
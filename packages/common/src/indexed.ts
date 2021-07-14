export class Indexed<T> implements Iterable<[number, T]> {
  constructor(public items: T[] = []) {}

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
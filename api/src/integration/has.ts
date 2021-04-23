export interface Has<V> {
  text: Has<string>;
}

export interface HasMany<V> {
  length: HasMany<number>;
}

class Assert<V> implements Has<V>, HasMany<V> {
  get text(): Has<string> {
    throw Error('not implemented');
  }

  get length(): HasMany<number> {
    throw Error('not implemented');
  }
}

export const has: Has<any> & HasMany<any> = new Assert<any>();
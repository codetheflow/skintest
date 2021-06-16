export class Checked<T> {
  constructor(
    public readonly data: T,
    public state: boolean
  ) {
  }
}

export function convert<T>(list: T[], search: T[] | ReadonlyArray<T>): Checked<T>[] {
  const set = new Set(search);
  return list.map(x => new Checked(x, set.has(x)));
}

export function convertBack<T>(list: Checked<T>[]): T[] {
  return list.filter(x => x.state).map(x => x.data);
}
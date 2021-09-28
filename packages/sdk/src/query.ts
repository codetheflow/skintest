// todo: move to web?
export abstract class Query<E = unknown> {
  // we need to keep something with type V, to turn on type checking
  // todo: investigate better solution
  private token?: E;

  type: 'query' = 'query';
  abstract toString(): string;
}

export abstract class QueryList<E = unknown> {
  private token?: E;

  type: 'queryList' = 'queryList';
  abstract toString(): string;
}
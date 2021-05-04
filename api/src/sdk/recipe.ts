import { invalidArgumentError } from '../common/errors';
import { Guard } from '../common/guard';
import { DOMElement } from './dom';
import { Engine } from './engine';
import { UIStep } from './path';
import { Query, QueryList } from './query';

export type ClientDo =
  Promise<{
    message: string,
    steps: UIStep[]
  }>;

export type ClientFunction = (this: Client, ...args: any[]) => ClientDo;

export interface ClientRecipe<T extends ClientFunction> {
  type: 'client',
  action: T;
}

export interface ClientElement<T extends DOMElement> {
}

export type ClientElementList<T extends DOMElement> = ClientElement<T>[];

export interface Client {
  do(message: string, ...steps: UIStep[]): ClientDo;
  query<T extends DOMElement>(query: Query<T>): Promise<ClientElement<T>>;
  query<T extends DOMElement>(query: QueryList<T>): Promise<ClientElementList<T>>;
}

export class EngineClient implements Client {
  constructor(private engine: Engine) {
  }

  do(message: string, ...steps: UIStep[]): ClientDo {
    return Promise.resolve({
      message,
      steps
    });
  }

  query<T extends DOMElement>(query: Query<T>): Promise<ClientElement<T>>;
  query<T extends DOMElement>(query: QueryList<T>): Promise<ClientElementList<T>>;
  query(query: Query<any> | QueryList<any>): Promise<any> {
    Guard.notNull(query, 'query');

    const selector = query.toString();
    switch (query.type) {
      case 'query': return this.engine.select(selector);
      case 'queryList': return this.engine.selectAll(selector);
      default: throw invalidArgumentError('type', (query as any).type);
    }
  }
}

export type ServerDo =
  Promise<{
    message: string,
  }>;

export type ServerFunction = (this: Server, ...args: any[]) => ServerDo;

export interface ServerRecipe<T extends ServerFunction> {
  type: 'server',
  action: T;
}

export interface Server {
  do(message: string): ServerDo;
}

export class Process implements Server {
  do(message: string): ServerDo {
    return Promise.resolve({
      message
    });
  }
}

export const recipe = {
  client<T extends ClientFunction>(action: T): ClientRecipe<T> {
    return {
      type: 'client',
      action
    };
  },

  server<T extends ServerFunction>(action: T): ServerRecipe<T> {
    return {
      type: 'server',
      action
    };
  },
};

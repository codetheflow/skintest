import { errors, Guard, reinterpret } from '@skintest/common';
import { DOMElement } from './dom';
import { Page } from './page';
import { Query, QueryList } from './query';
import { StorySchema } from './schema';

export type ClientDo =
  Promise<{
    message: string,
    plan: StorySchema,
  }>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClientFunction = (this: Client, ...args: any[]) => ClientDo;

export interface ClientRecipe<T extends ClientFunction> {
  type: 'client',
  action: T;
}

export abstract class ClientElement<T extends DOMElement = never> {
  // we need to keep something with type V, to turn on type checking
  // todo: investigate better solution
  private token?: T;
}

export type ClientElementList<T extends DOMElement = never> = ClientElement<T>[];

export interface Client {
  do(message: string, ...plan: StorySchema): ClientDo;
  query<E extends DOMElement>(query: Query<E>): Promise<ClientElement<E>>;
  query<E extends DOMElement>(query: QueryList<E>): Promise<ClientElementList<E>>;
}

export class PageClient implements Client {
  constructor(private page: Page) {
  }

  do(message: string, ...plan: StorySchema): ClientDo {
    return Promise.resolve({
      message,
      plan
    });
  }

  query<E extends DOMElement>(query: Query<E>): Promise<ClientElement<E>>;
  query<E extends DOMElement>(query: QueryList<E>): Promise<ClientElementList<E>>;
  query(query: Query<DOMElement> | QueryList<DOMElement>): Promise<ClientElement<DOMElement> | ClientElementList<DOMElement>> {
    Guard.notNull(query, 'query');

    const selector = query.toString();
    switch (query.type) {
      case 'query': return this.page.query(selector);
      case 'queryList': return this.page.queryList(selector);
      default: throw errors.invalidArgument('type', reinterpret<Query>(query).type);
    }
  }
}

export type ServerDo = Promise<{ message: string, }>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
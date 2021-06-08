import { errors, Guard, reinterpret } from '@skintest/common';
import { DOMElement } from './dom';
import { ElementClassList, ElementState } from './element';
import { Page } from './page';
import { Query, QueryList } from './query';

export abstract class ClientElement<T extends DOMElement = never> {
  // we need to keep something with type V, to turn on type checking
  // todo: investigate better solution
  private token?: T;

  abstract attribute(name: string): Promise<string | null>;
  abstract classList(): Promise<ElementClassList>;
  abstract state(state: ElementState): Promise<boolean>;
  abstract style(name: string): Promise<string | null>;
  abstract text(): Promise<string>;
}

export type ClientElementList<T extends DOMElement = never> = ClientElement<T>[];

export interface Client {
  page: ClientPage;
}

export interface ClientPage {
  query<E extends DOMElement>(query: Query<E>): Promise<ClientElement<E>>;
  query<E extends DOMElement>(query: QueryList<E>): Promise<ClientElementList<E>>;
}

export class ClientPageBoy implements ClientPage {
  constructor(private page: Page) {
  }

  query<E extends DOMElement>(query: Query<E>): Promise<ClientElement<E>>;
  query<E extends DOMElement>(query: QueryList<E>): Promise<ClientElementList<E>>;
  async query(query: Query<DOMElement> | QueryList<DOMElement>): Promise<ClientElement<DOMElement> | ClientElementList<DOMElement>> {
    Guard.notNull(query, 'query');

    const selector = query.toString();
    switch (query.type) {
      case 'query': {
        const element = await this.page.query(selector);
        if (!element) {
          throw errors.elementNotFound(selector);
        }

        return element;
      }
      case 'queryList': {
        return this.page.queryList(selector);
      }
      default: {
        throw errors.invalidArgument('type', reinterpret<Query>(query).type);
      }
    }
  }
}
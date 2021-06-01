import { errors, Guard, reinterpret } from '@skintest/common';
import { DOMElement } from '../dom';
import { ElementClassList, ElementState } from '../element';
import { getCaller, getStepMeta } from '../meta';
import { Page } from '../page';
import { Query, QueryList } from '../query';
import { StorySchema } from '../schema';
import { WaitStep } from '../steps/wait';
import { WaitDownloadStep } from '../steps/wait-download';

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

  abstract attribute(name: string): Promise<string | null>;
  abstract classList(): Promise<ElementClassList>;
  abstract state(state: ElementState): Promise<boolean>;
  abstract style(name: string): Promise<string | null>;
  abstract text(): Promise<string>;
}

export type ClientElementList<T extends DOMElement = never> = ClientElement<T>[];

export type ClientWaitEvents = {
  download: { save(name: string): ClientWaitHooks },
};

export type ClientStory = (message: string, ...plan: StorySchema) => ClientDo;

export type ClientWaitHooks = {
  when: ClientStory;
}

export interface Client {
  page: {
    do: ClientStory;
    wait<E extends keyof ClientWaitEvents>(event: E): ClientWaitEvents[E];
    query<E extends DOMElement>(query: Query<E>): Promise<ClientElement<E>>;
    query<E extends DOMElement>(query: QueryList<E>): Promise<ClientElementList<E>>;
  };
}

export class ClientPage {
  constructor(private page: Page) { }

  wait<E extends keyof ClientWaitEvents>(event: E): ClientWaitEvents[E] {
    const caller = getCaller();
    const getMeta = () => getStepMeta(caller);

    switch (event) {
      case 'download': {
        const download: ClientWaitEvents['download'] = {
          save(path: string) {
            return {
              when(message: string, ...plan: StorySchema) {
                return Promise.resolve({
                  message,
                  plan: [
                    new WaitStep(
                      getMeta,
                      [new WaitDownloadStep(getMeta, path)],
                      plan
                    )
                  ]
                });
              }
            };
          }
        };

        return download;
      }
      default: {
        throw errors.invalidArgument('event', event);
      }
    }
  }

  do(message: string, ...plan: StorySchema): ClientDo {
    return Promise.resolve({
      message,
      plan
    });
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
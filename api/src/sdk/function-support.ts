import { UIStep } from './path';

export interface ClientRecipe<T extends ((...args: any) => ClientDo)> {
  type: 'client',
  action: T;
}

export type ClientDo =
  Promise<{
    message: string,
    steps: UIStep[]
  }>;

export const client = {
  recipe<T extends ((...args: any) => ClientDo)>(action: T): ClientRecipe<T> {
    return {
      type: 'client',
      action
    };
  },

  do(message: string, ...steps: UIStep[]): ClientDo {
    return Promise.resolve({
      message,
      steps
    });
  }
};

export interface ServerRecipe<T extends ((...args: any) => ServerDo)> {
  type: 'server',
  action: T;
}

export type ServerDo =
  Promise<{
    message: string,
  }>;

export const server = {
  recipe<T extends ((...args: any) => ServerDo)>(action: T): ServerRecipe<T> {
    return {
      type: 'server',
      action
    };
  },

  do(message: string): ServerDo {
    return Promise.resolve({
      message,
    });
  }
};

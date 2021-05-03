import { ClientStep } from './command';

export const client = {
  recipe(message: string, ...steps: ClientStep[]): ClientDo {
    return {
      type: 'client',
      body: Promise.resolve({
        message,
        steps
      })
    };
  }
};

export type ClientDo = {
  type: 'client',
  body: Promise<{
    message: string,
    steps: ClientStep[]
  }>
};

export const server = {
  recipe(message: string): ServerDo {
    return {
      type: 'server',
      body: Promise.resolve({
        message
      })
    };
  }
};

export type ServerDo = {
  type: 'server',
  body: Promise<{
    message: string
  }>
};

export type Do = ClientDo | ServerDo;

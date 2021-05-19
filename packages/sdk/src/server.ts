import { StorySchema } from './schema';

export const client = {
  recipe(message: string, ...plan: StorySchema): ClientDo {
    return {
      type: 'client',
      body: Promise.resolve({
        message,
        plan
      })
    };
  }
};

export type ClientDo = {
  type: 'client',
  body: Promise<{
    message: string,
    plan: StorySchema
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

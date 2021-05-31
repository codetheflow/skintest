
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
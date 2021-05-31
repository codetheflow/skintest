import { ClientFunction, ClientRecipe } from './recipes/client';
import { ServerFunction, ServerRecipe } from './recipes/server';
import { ThatFunction, ThatRecipe } from './recipes/that';

export const recipe = {
  client<A extends ClientFunction>(action: A): ClientRecipe<A> {
    return {
      type: 'client',
      action
    };
  },

  server<A extends ServerFunction>(action: A): ServerRecipe<A> {
    return {
      type: 'server',
      action
    };
  },

  assert<A extends ThatFunction>(action: A): ThatRecipe<A> {
    return {
      type: 'assert',
      action
    };
  }
};
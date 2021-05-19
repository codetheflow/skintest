import { I, recipe } from '@skintest/sdk';
import { add_todo } from './add-todo';

export const generate_todos = recipe.client(
  /**
   * generate todo times and put them to the list of todos
   * 
   * @param count number of items to generate
   * @returns generate todos client recipe
   */
  function (count: number) {
    const client = this;
    const path = [...Array(count)].map((x, i) => I.do(add_todo, `generated todo #${i}`))
    return client.do(`I generate ${count} todos`, ...path);
  }
);

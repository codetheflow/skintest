import { recipe, I } from '@skintest/api';
import { add_todo } from './add-todo';

export const generate_todos = recipe.client(
  /**
   * generate todo times and put them to the list of todos
   * 
   * @param count number of items to generate
   * @returns genearte todos client recipe
   */
  function (count: number) {
    const client = this;
    const path = [...Array(count)].map((x, i) => I.do(add_todo, `geneated todo #${i}`))
    return client.do(`generate ${count} todos`, ...path);
  }
);

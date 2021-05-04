import { recipe, I, UIStep } from '@skintest/api';
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

    const path: UIStep[] = [];
    let last = count;
    while (last-- > 0) {
      path.push(I.do(add_todo, `geneated todo #${last}`));
    }

    return client.do(`generate ${count} todos`, ...path);
  }
);

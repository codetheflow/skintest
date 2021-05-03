import { client, I, UIStep } from '@skintest/api';
import { add_todo } from './add-todo';

export const generate_todos = client.recipe(
  /**
   * generate todo times and put them to the list of todos
   * 
   * @param count number of items to generate
   * @returns genearte todos client recipe
   */
  function (count: number) {
    const path: UIStep[] = [];
    while (count-- > 0) {
      path.push(I.do(add_todo, `geneated todo #${count}`));
    }

    return client.do(`generate ${count} todos`, ...path);
  }
);

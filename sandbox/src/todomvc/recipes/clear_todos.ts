import { recipe, I, UIStep } from '@skintest/api';
import { todos } from '../components';

export const clear_todos = recipe.client(
  /**
   * clear toodos list
   * 
   * @returns clear todos client recipe
   */
  async function () {
    const client = this;

    const remove = (index: number) => [
      I.hover(todos.item_at(index)),
      I.click(todos.remove_button_at(index))
    ];

    const list = await client.query(todos.list);
    let last = list.length - 1;
    const steps: UIStep[] = [];
    while (last >= 0) {
      steps.push(...remove(last));
      last--;
    }

    return client.do(`clear todos`, ...steps);
  }
);

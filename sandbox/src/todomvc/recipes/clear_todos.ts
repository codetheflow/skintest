import { recipe, I, StorySchema } from '@skintest/api';
import { todos } from '../components/todos';

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
    const plan: StorySchema = [];
    while (last >= 0) {
      plan.push(...remove(last));
      last--;
    }

    return client.do(`clear todos`, ...plan);
  }
);

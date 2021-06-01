import { I, recipe } from '@skintest/sdk';
import { todos } from '../components/todos';

export const clear_todos = recipe.client(
  /**
   * clear todos list
   * 
   * @returns clear todos client recipe
   */
  async function () {
    const { page } = this;

    const remove = (index: number) => [
      I.hover(todos.item_label_at(index)),
      I.click(todos.item_remove_at(index)),
    ];

    const list = await page.query(todos.list);
    let last = list.length - 1;
    const plan = [];
    while (last >= 0) {
      plan.push(...remove(last));
      last--;
    }

    return page.do(`I clear todos`, ...plan);
  }
);
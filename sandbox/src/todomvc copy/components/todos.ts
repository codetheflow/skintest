import { $, $$ } from '@skintest/sdk';
import { env } from '../project/env';

export const todos = {
  url: env.url

  , what: $<HTMLInputElement>`.new-todo`

  , list: $$<HTMLElement>`.todo-list > li`
  , clear_completed: $<HTMLButtonElement>`.clear-completed`

  , item_at: (index: number) => $<HTMLLIElement>`${todos.list}:nth-child(${index + 1})`
  , item_label_at: (index: number) => $<HTMLElement>`${todos.item_at(index)} label`
  , item_remove_at: (index: number) => $<HTMLButtonElement>`${todos.item_at(index)} button.destroy`
  , item_complete_at: (index: number) => $<HTMLInputElement>`${todos.item_at(index)} input[type=checkbox]`
};
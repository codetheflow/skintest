import { $, $$ } from '@skintest/api';
import { env } from '../project';

export const todos = {
  url: env.url

  , what: $<HTMLInputElement>('input.new-todo')
  , clear_completed: $<HTMLButtonElement>('button.clear-completed')

  , list: $$<HTMLElement>('.todo-list > li')
  , item: (text: string) => $(`li.completed label[innerText=${text}]`)
  , item_at: (index: number) => $(`.todo-list > li:nth-child(${index}) label`)

  , item_delete: (text: string) => $(`li.completed label[innerText=${text}] button.destroy`)
};

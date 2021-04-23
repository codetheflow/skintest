import { $, $$ } from '@skintest/api';
import { env, data } from '../project';

export const todos = {
  url: env.url

  , what: $<HTMLInputElement>('input.new-todo')
  , clear_completed: $<HTMLButtonElement>('button.clear-completed')

  , list: $$<HTMLElement>('li.completed')
  , item: (text: string) => $(`li.completed label[innerText=${text}]`)
  , item_at: (index: number) => $(`li.completed:nth-child(${index})`)

  , item_delete: (text: string) => $(`li.completed label[innerText=${text}] button.destroy`)
};

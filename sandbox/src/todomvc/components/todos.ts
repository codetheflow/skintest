import { $, $$ } from '@skintest/api';
import { env, data } from '../project';

export const todos = {
  url: env.url

  , what_todo: $<HTMLInputElement>('input.new-todo')
  , clear_all: $<HTMLButtonElement>('button.clear-completed')

  , items: $$<HTMLElement>('li.completed')
  , item: (text: string) => $(`li.completed label[innerText=${text}]`)
  , item_delete: (text: string) => $(`li.completed label[innerText=${text}] button.destroy`)
};

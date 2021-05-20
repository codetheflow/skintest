import { $, $$ } from '@skintest/sdk';
import { env } from '../project/env';

export const todos = {
  url: env.url

  , what: $<HTMLInputElement>('input.new-todo')
  , clear_completed: $<HTMLButtonElement>('button.clear-completed')

  , list: $$<HTMLElement>('.todo-list > li')
  , item: (text: string) => $(`.todo-list li label[innerText=${text}]`)
  , item_at: (index: number) => $(`.todo-list1 li:nth-child(${index + 1}) label`)

  , remove: (text: string) => $(`.todo-list li label[innerText=${text}] button.destroy`)
  , remove_at: (index: number) => $(`.todo-list > li:nth-child(${index + 1}) button.destroy`)
};
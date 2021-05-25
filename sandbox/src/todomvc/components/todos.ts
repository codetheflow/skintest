import { $, $$ } from '@skintest/sdk';
import { env } from '../project/env';

export const todos = {
  url: env.url

  , what: $<HTMLInputElement>('input.new-todo')

  , list: $$<HTMLElement>('.todo-list > li')
  , clear_completed: $('button.clear-completed')

  , item_at: (index: number) => $(`.todo-list li:nth-child(${index + 1})`)

  , item_label: (text: string) => $(`.todo-list li label[innerText="${text}"]`)
  , item_label_at: (index: number) => $(`.todo-list li:nth-child(${index + 1}) label`)

  , remove_button: (text: string) => $(`.todo-list li label[innerText="${text}"] button.destroy`)
  , remove_button_at: (index: number) => $(`.todo-list > li:nth-child(${index + 1}) button.destroy`)

  , complete_checkbox_at: (index: number) => $(`.todo-list > li:nth-child(${index + 1}) input[type=checkbox]`)
};
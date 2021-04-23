import { $, $$ } from '@skintest/api';
import { env, data } from '../project';

export const todos = {
  url: env.todos_url

  , txt_file: data.todos_txt

  , what: $<HTMLTextAreaElement>('#todos-whattodo')
  , add_todo: $<HTMLButtonElement>('#todos-addtodo')
  , clear_all: $<HTMLButtonElement>('#todos-clearall')

  , list: $$<HTMLElement>('li.todo-item')
  , item: (text: string) => $(`li.todo-item[innerText=${text}]`)
  , item_delete: (text: string) => $(`li.todo-item[innerText=${text}] .delete`)

  , upload_form: $<HTMLFormElement>('#todos-updload-form')
  , upload: $<HTMLButtonElement>('#todos-upload')
};

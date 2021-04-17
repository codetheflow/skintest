import { $, $$ } from '@skintest';
import { env, data } from '@my/todos';

export const todos = {
  url: env.todos_url

  , txt_file: data.todos_txt

  , what_todo: $<HTMLTextAreaElement>('#todos-whattodo')
  , add_todo: $<HTMLButtonElement>('#todos-addtodo')
  , clear_all: $<HTMLButtonElement>('#todos-clearall')

  , items: $$<HTMLElement>('li.todo-item')
  , item: (text: string) => $(`li.todo-item[innerText=${text}]`)
  , item_delete: (text: string) => $(`li.todo-item[innerText=${text}] .delete`)

  , upload_form: $<HTMLFormElement>('#todos-updload-form')
  , upload: $<HTMLButtonElement>('#todos-upload')
};

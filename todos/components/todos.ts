import { select, selectAll } from '@testcloud';
import { env, data } from '@my/todos';

export const todos = {
  url: env.todos_url

  , txt_file: data.todos_txt

  , what_todo: select<HTMLTextAreaElement>('#todos-whattodo')
  , add_todo: select<HTMLButtonElement>('#todos-addtodo')

  , items: selectAll<HTMLElement>('li.todo-item')
  , item: (text: string) => select(`li.todo-item[innerText=${text}]`)
  , item_delete: (text: string) => select(`li.todo-item[innerText=${text}] .delete`)

  , upload_form: select<HTMLFormElement>('#todos-updload-form')
  , upload: select<HTMLButtonElement>('#todos-upload')
}

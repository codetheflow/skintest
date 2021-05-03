import { I, client } from '@skintest/api';
import { todos } from '../components';

export const add_todo = client.recipe(
 /**
  * add new todo item to the list of todos
  * 
  * @param name tile of the new todo
  * @returns todo client recipe
  */
  function (name: string) {
    return client.do(`add todo \`${name}\``
      , I.fill(todos.what, name)
      , I.press('Enter')
    );
  }
);


// export const prepare_db = server.recipe(
//   function (endpoint: string) {

//   }
// );
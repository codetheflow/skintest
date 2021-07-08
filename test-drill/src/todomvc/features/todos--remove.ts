import { feature, has, I } from '@skintest/sdk';
import { $page } from '../components/$page';
import { $todos } from '../components/$todos';
import { add_todo } from '../tasks/add-todo';
import { clear_todos } from '../tasks/clear-todos';

feature()

  .before('scenario'
    , I.open($page.start)
    , I.goto($todos.url)
    , I.do(clear_todos)
  )

  .scenario('check the remove button deletes items'
    , I.do(add_todo, 'item to remove')
    , I.hover($todos.item_label_at(0))
    , I.click($todos.item_remove_at(0))
    , I.check('todos list is empty after remove button clicked')
    , I.see($todos.list, has.length, 0)
  )
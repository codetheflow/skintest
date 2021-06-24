import { test } from '@skintest/enterprise';
import { feature, has, I } from '@skintest/sdk';
import { page } from '../components/page';
import { todos } from '../components/todos';
import { add_todo } from '../recipes/add-todo';
import { clear_todos } from '../recipes/clear-todos';

feature()

  .before('scenario'
    , I.open(page.start)
    , I.goto(todos.url)
    , I.do(clear_todos)
  )

  .scenario('#now test login'
    , test.cases(
      { label: 'todo1', n: 1 },
      { label: 'todo2', n: 1 },
      { label: 'todo3', n: 1 },
    )

    , I.do(add_todo, test.data('label'))
    , I.check('todo was added')
    , I.see(todos.item_label_at(0), has.text, test.data('label'))
  )
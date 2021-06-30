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

  .scenario('check the complete checkbox marks item as completed'
    , I.do(add_todo, 'win a gold')
    , I.mark(todos.item_complete_at(0), 'checked')
    , I.check('completed item has a corresponding class')
    , I.see(todos.item_at(0), has.class, 'completed')
    , I.see(todos.item_label_at(0), has.style, ['text-decoration', /line-through/])
  )

  .scenario('check the clear completed button removes completed items from the list'
    , I.do(add_todo, 'win a gold')
    , I.do(add_todo, 'drink a wine')
    // todo: use `win a gold` instead of 0 index
    , I.mark(todos.item_complete_at(0), 'checked')
    , I.click(todos.clear_completed)
    , I.check('completed todos are not visible after click clear')
    , I.see(todos.list, has.length, 1)
    , I.see(todos.item_at(0), has.text, 'drink a wine')
  )
import { feature, has, I } from '@skintest/api';
import { todos } from '../components';

feature('todo list')

  .before('scenario'
    , I.amOnPage(todos.url)
  )

  .scenario('when page is initially opened'
    , I.check('focus on the todo input field')
    , I.see(todos.what, has.focus)
  )

  .scenario('adding new todos'
    , I.fill(todos.what, 'learn testing')
    , I.press('Enter')
    , I.fill(todos.what, 'be cool')
    , I.press('Enter')
    , I.check('todo list contains added items')
    , I.see(todos.list, has.length, 2)
    , I.see(todos.item_at(0), has.text, 'learn testing')
    , I.see(todos.item_at(1), has.text, 'be cool')
  )

  .scenario('adding new todos'
    , I.fill(todos.what, 'learn testing')
    , I.check('input filed should have entered text')
    , I.see(todos.what, has.value, 'learn testing')
  )

  .scenario('adding new todos'
    , I.check('input filed should be empty when an item is added')
    , I.see(todos.what, has.value, '')
  )
import { feature, has, I } from '@skintest/api';
import { todos } from '../components';
import { add_todo, clear_todos, generate_todos } from '../recipes';

feature('todo list')
  .before('scenario'
    , I.amOnPage(todos.url)
    , I.do(clear_todos)
  )

  .scenario('test the remove button'
    , I.do(add_todo, 'item to remove')
    , I.hover(todos.item_at(0))
    , I.click(todos.remove_button_at(0))
    , I.check('todos list is empty after remove button clicked')
    , I.see(todos.list, has.length, 0)
  )

  .scenario('test the input field should be in focus on initial load'
    , I.check('focus in the input field')
    , I.see(todos.what, has.focus)
  )

  .scenario('test the list has all added items'
    , I.fill(todos.what, 'learn testing')
    , I.press('Enter')
    , I.fill(todos.what, 'be cool')
    , I.press('Enter')
    , I.check('list contains added items')
    , I.see(todos.list, has.length, 2)
    , I.see(todos.item_at(0), has.text, 'learn testing')
    , I.see(todos.item_at(1), has.text, 'be cool')
  )

  .scenario('test the input field should contain entered text'
    , I.fill(todos.what, 'congratulate grandma')
    , I.check('input field has entered text')
    , I.see(todos.what, has.value, 'congratulate grandma')
  )

  .scenario('test the input file should be empty after item was added'
    , I.do(add_todo, 'call dad')
    , I.check('input field is empty')
    , I.see(todos.what, has.value, '')
  )

  .scenario('test item text is trimmed after it added to the list'
    , I.do(add_todo, '  prepare presentation  ')
    , I.check('todo item contains trimmed text')
    , I.see(todos.item_at(0), has.text, 'prepare presentation')
  )

  .scenario('test the list supports many todos'
    , I.do(generate_todos, 10)
    , I.check('list contains all the items')
    , I.see(todos.list, has.length, 10)
  )
import { feature, has, I } from '@skintest/api';
import { todos } from '../components/todos';
import { add_todo } from '../recipes/add-todo';
import { clear_todos } from '../recipes/clear_todos';
import { generate_todos } from '../recipes/generate-todos';

feature('#dev todo list')
  .before('scenario'
    , I.visit(todos.url)
    , I.do(clear_todos)
  )

  .scenario('check the input field should be in focus on initial load'
    , I.test('focus in the input field')
    , I.see(todos.what, has.focus)
    , I.see(todos.what, has.focus)
  )

  .scenario('check the list has all added items'
    , I.fill(todos.what, 'learn testing')
    , I.press('Enter')
    , I.fill(todos.what, 'be cool')
    , I.press('Enter')
    , I.test('list contains added items')
    , I.see(todos.list, has.length, 2)
    , I.see(todos.item_at(0), has.text, 'learn testing')
    , I.see(todos.item_at(1), has.text, 'be cool')
  )

  .scenario('check the input field should contain entered text'
    , I.fill(todos.what, 'congratulate grandma')
    , I.test('input field has entered text')
    , I.see(todos.what, has.value, 'congratulate grandma')
  )

  .scenario('check the input file should be empty after item was added'
    , I.do(add_todo, 'call dad')
    , I.test('input field is empty')
    , I.see(todos.what, has.value, '')
  )

  .scenario('check item text is trimmed after it added to the list'
    , I.do(add_todo, '  prepare presentation  ')
    , I.test('todo item contains trimmed text')
    , I.see(todos.item_at(0), has.text, 'prepare presentation')
  )

  .scenario('check the list supports many todos'
    , I.do(generate_todos, 10)
    , I.test('list contains all the items')
    , I.see(todos.list, has.length, 10)
  )

  .scenario('check the remove button deleted items'
    , I.do(add_todo, 'item to remove')
    , I.hover(todos.item_at(0))
    , I.click(todos.remove_button_at(0))
    , I.test('todos list is empty after remove button clicked')
    , I.see(todos.list, has.length, 0)
  )
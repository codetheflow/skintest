import { feature, has, I } from '@skintest/sdk';
import { page } from '../components/page';
import { todos } from '../components/todos';
import { add_todo } from '../recipes/add-todo';
import { clear_todos } from '../recipes/clear-todos';
import { generate_todos } from '../recipes/generate-todos';

feature('todos add')
  .before('scenario'
    , I.open(page.start)
    , I.goto(todos.url)
    , I.do(clear_todos)
  )

  .scenario('check the input field should be in focus on initial load'
    , I.test('focus in the input field')
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
    , I.do(add_todo, '  pass the exams  ')
    , I.test('todo item contains trimmed text')
    , I.see(todos.item_at(0), has.text, 'pass the exams')
  )

  .scenario('#now check the list supports many todos'
    , I.do(generate_todos, 10)
    , I.test('list contains all the items')
    , I.see(todos.list, has.length, 10)
  )

  .scenario('check that second todo page has updated list after reload'
    , I.open(page.one)
    , I.goto(todos.url)

    , I.open(page.two)
    , I.goto(todos.url)
    , I.do(add_todo, 'walk the dog')

    , I.open(page.one)
    , I.reload()

    , I.test('page one has the same items as page two')
    , I.see(todos.list, has.length, 1)
    , I.see(todos.item_at(0), has.text, 'walk the dog')
  )

  .scenario('check that todo item can be copy pasted by using clipboard'
    , I.do(add_todo, 'feed dragon')
    , I.select(todos.item_at(0))
    , I.press('Control+C')
    // todo: investigate why focus doesn't work?
    , I.focus(todos.what)
    , I.fill(todos.what, '')
    , I.press('Control+V')
    , I.test('input has the same value as first todo')
    , I.see(todos.what, has.value, 'feed dragon')
  )
import { feature, has, I } from '@skintest/api';
import { todos } from '../components';
import { add_todo, generate_todos } from '../functions';

feature('todo list')

  .before('scenario'
    , I.amOnPage(todos.url)
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

  .scenario('test the list supports big ammount of todos'
  , I.do(generate_todos, 10)
  , I.check('list contains all the items')
  , I.see(todos.list, has.length, 10)
)

  // it('should trim text input', function () {
  //   // this is an example of another custom command
  //   // since we repeat the todo creation over and over
  //   // again. It's up to you to decide when to abstract
  //   // repetitive behavior and roll that up into a custom
  //   // command vs explicitly writing the code.
  //   cy.createTodo(`    ${TODO_ITEM_ONE}    `)

  //   // we use as explicit assertion here about the text instead of
  //   // using 'contain' so we can specify the exact text of the element
  //   // does not have any whitespace around it
  //   cy.get('.todo-list li')
  //     .eq(0)
  //     .should('have.text', TODO_ITEM_ONE)
  // })
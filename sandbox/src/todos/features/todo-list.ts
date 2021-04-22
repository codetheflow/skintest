import { feature, I } from '@skintest/api';
import { todos, user } from '../components';
import { login, clear_db } from '../functions';

feature('todo list')

  .before('feature'
    , I.do(login, user)
    , I.amOnPage(todos.url)
  )

  .before('scenario'
    , I.click(todos.clear_all)
  )

  .after('feature'
    , I.do(clear_db, 'todo-list')
  )

  .scenario('add todo items'
    , I.fill(todos.what_todo, 'call to my friend')
    , I.click(todos.add_todo)
    , I.see(todos.item('call to my friend'))

    , I.fill(todos.what_todo, 'make a video')
    , I.click(todos.add_todo)
    , I.see(todos.item('make a video'))
  )

  .scenario('remove todo item by mouse'
    , I.fill(todos.what_todo, 'meal my mouse')
    , I.click(todos.add_todo)
    , I.see(todos.item('meal my mouse'))

    , I.click(todos.item_delete('meal my mouse'))
    , I.dontSee(todos.item('meal my mouse'))
  )

  .scenario('remove todo item by keyboard'
    , I.fill(todos.what_todo, 'clean my keyboard')
    , I.click(todos.add_todo)
    , I.see(todos.item('clean my keyboard'))

    , I.focus(todos.item('clean my keyboard'))
    , I.press('Delete')
    , I.dontSee(todos.item('clean my keyboard'))
  )

  .scenario('clear all todo items'
    , I.fill(todos.what_todo, 'say Hi to Bob')
    , I.click(todos.add_todo)
    , I.see(todos.item('say Hi to Bob'))

    , I.fill(todos.what_todo, 'say Hey to John')
    , I.click(todos.add_todo)
    , I.see(todos.item('say Hey to John'))

    , I.click(todos.clear_all)
    , I.see(todos.items.length, 0)
  )

  .scenario('export todos from txt file'
    , I.attachFile(todos.upload_form, todos.txt_file)
    , I.click(todos.upload)
    , I.see(todos.items.length, 3)
  )

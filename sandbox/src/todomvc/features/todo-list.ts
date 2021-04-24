import { feature, has, I } from '@skintest/api';
import { todos } from '../components';

feature('todo list')

  .before('scenario'
    , I.amOnPage(todos.url)
  )


  .after('scenario'
    // if visible?
    // , I.click(todos.clear_all)
    , I.pause()
  )


  .scenario('add 2 todos'
    , I.fill(todos.what, 'learn testing')
    , I.press('Enter')
    , I.fill(todos.what, 'be cool')
    , I.press('Enter')

    , I.see(todos.list, has.length, 2)
    , I.see(todos.list, has.length.above, 0)
    , I.see(todos.list, has.length.below, 3)
    , I.see(todos.item_at(0), has.text, 'learn testing')
    , I.see(todos.item_at(1), has.text.match, /cool/i)
  )

  // .scenario('check if input is empty when an item is added'
  //   , I.fill(todos.what, 'learn testing')
  //   , I.press('Enter')
  //   , I.see(todos.what, '')

  //   , I.see(todos.list, has.length, 3)
  //   , I.see(todos.list, has.length.above, 3)
  //   , I.see(todos.what, has.text, 'learn testing')
  //   , I.see(todos.item_at(0), has.class, 'completed')
  //   , I.see(todos.item_at(1), has.attr, 'disabled')
  //   , I.see(todos.item_at(2), has.attr, 'disabled=true')
  //   , I.see(todos.what, has.style, 'display: none')
  // )

import { copy, named, paste } from '@skintest/enterprise';
import { feature, from } from '@skintest/sdk';
import { has } from '@skintest/web';
import { I } from '../../actor';
import { $todos } from '../components/$todos';
import { add_todo } from '../tasks/add-todo';
import { clear_todos } from '../tasks/clear-todos';
import { generate_todos } from '../tasks/generate-todos';

feature()

  .before('scenario'
    , I.open('page', named.a)
    , I.goto($todos.url)
    , I.do(clear_todos)
  )

  .scenario('check the input field should be in focus on initial load'
    , I.check('focus in the input field')
    , I.see($todos.what, has.state, 'focused')
  )

  .scenario('check the input field should have placeholder'
    , I.check('placeholder in the input field')
    , I.see($todos.what, has.attribute, ['placeholder', 'What needs to be done?'])
  )

  .test('data'
    , { label: 'learn testing' }
    , { label: 'be cool' }
  )
  .scenario('check the list has all added items'
    , I.do(add_todo, from('label'))
    , I.check('todo item is added')
    , I.see($todos.item_label_last, has.text, from('label'))
    , I.see($todos.item_label_last, has.text, from('label'))
  )

  .scenario('check the input field should contain entered text'
    , I.fill($todos.what, 'congratulate grandma')
    , I.check('input field has entered text')
    , I.see($todos.what, has.text, 'congratulate grandma')
  )

  .scenario('check the input file should be empty after item was added'
    , I.do(add_todo, 'call dad')
    , I.check('input field is empty')
    , I.see($todos.what, has.text, '')
  )

  .scenario('check item text is trimmed after it added to the list'
    , I.do(add_todo, '  pass the exams  ')
    , I.check('todo item contains trimmed text')
    , I.see($todos.item_label_at(0), has.text, 'pass the exams')
  )

  .scenario('check the list supports many todos'
    , I.do(generate_todos, 10)
    , I.check('list contains all the items')
    , I.see($todos.list, has.length, 10)
  )

  .scenario('check that second todo page has updated list after reload'
    , I.open('page', named.b)
    , I.goto($todos.url)

    , I.open('page', named.c)
    , I.goto($todos.url)
    , I.do(add_todo, 'walk the dog')

    , I.open('page', named.b)
    , I.reload()

    , I.check('page one has the same items as page two')
    , I.see($todos.list, has.length, 1)
    , I.see($todos.item_label_at(0), has.text, 'walk the dog')
  )

  .scenario('check that todo item can be copy pasted by using clipboard'
    , I.do(add_todo, 'feed dragon')
    , I.do(copy, $todos.item_label_at(0))
    , I.do(paste, $todos.what)
    , I.check('input has the same value as first todo')
    , I.see($todos.what, has.text, 'feed dragon')
  );
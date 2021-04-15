import { feature, I } from '@testcloud';
import { auth, home, user } from '@my/todos/components';

feature('app authentication')

  .before('feature'
    , I.amOnPage(auth.url)
  )

  .scenario('login with invalid credentials'
    , I.fill(auth.login, 'no-such-a-user')
    , I.fill(auth.password, 'no-such-a-password')
    , I.click(auth.sign_in)
    , I.see(auth.status, 'error login')
  )

  .scenario('login with valid credentials'
    , I.fill(auth.login, user.login)
    , I.fill(auth.password, user.password)
    , I.click(auth.sign_in)
    , I.waitUrl(home.url)
    , I.see(home.user, user.name)
    , I.say('signed in!')
  )

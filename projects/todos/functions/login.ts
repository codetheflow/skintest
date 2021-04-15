import { I } from '@testcloud';
import { auth, toolbar, home, user } from '@my/todos/components';

export function login(identity: typeof user) {
  return [
    I.fill(auth.login, identity.login)
    , I.fill(auth.password, identity.password)
    , I.click(auth.sign_in)
    , I.waitUrl(home.url)
    , I.see(toolbar.user, identity.name)
    , I.say('signed in!')
  ];
}
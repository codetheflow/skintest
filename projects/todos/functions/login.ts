import { I, def, Definition } from '@testcloud';
import { auth, toolbar, user } from '@my/todos/components';

export function login(identity: typeof user): Definition {
  return def(`login with ${identity.name}`
    , I.fill(auth.login, identity.login)
    , I.fill(auth.password, identity.password)
    , I.click(auth.sign_in)
    , I.see(toolbar.user, identity.name)
    , I.say('signed in!')
  );
}
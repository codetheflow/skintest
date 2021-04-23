import { I, recipe, Do, has } from '@skintest/api';
import { auth, toolbar, user } from '../components';

export function login(identity: typeof user): Do {
  return recipe(`login with ${identity.name}`
    , I.fill(auth.login, identity.login)
    , I.fill(auth.password, identity.password)
    , I.click(auth.sign_in)
    , I.see(toolbar.user, has.text, identity.name)
    , I.say('signed in!')
  );
}
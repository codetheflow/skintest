import { select } from '@testcloud';
import { env } from '@my/todos';

export const auth = {
  url: env.auth_url

  , login: select<HTMLInputElement>('#auth-login')
  , password: select<HTMLInputElement>('#auth-password')
  , sign_in: select<HTMLButtonElement>('#auth-signin')
  , status: select<HTMLElement>('#auth-status')
};

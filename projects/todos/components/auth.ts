import { $ } from '@skintest';
import { env } from '@my/todos';

export const auth = {
  url: env.auth_url

  , login: $<HTMLInputElement>('#auth-login')
  , password: $<HTMLInputElement>('#auth-password')
  , sign_in: $<HTMLButtonElement>('#auth-signin')
  , status: $<HTMLElement>('#auth-status')
};

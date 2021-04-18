import { $ } from '@skintest/api';
import { env } from '../project';

export const auth = {
  url: env.auth_url

  , login: $<HTMLInputElement>('#auth-login')
  , password: $<HTMLInputElement>('#auth-password')
  , sign_in: $<HTMLButtonElement>('#auth-signin')
  , status: $<HTMLElement>('#auth-status')
};

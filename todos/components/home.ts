import { select } from '@testcloud';
import { env } from '@my/todos';

export const home = {
  url: env.home_url

  , user: select('#user-name')
}

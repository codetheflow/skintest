import { play, Do } from '@skintest';
import { env } from '@my/todos';

export async function clear_db(target: 'todo-list'): Do {
  const init = { method: 'POST', body: target };
  const { status, statusText } = await fetch(env.clear_db_url, init);

  const say = (text: string) => `clear ${target}, ${text}: ${statusText} `
  if (status === 200) {
    throw Error(say('fail'));
  }

  return play(say('pass'));
}
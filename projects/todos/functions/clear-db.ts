import { def, MyDefinition } from '@testcloud';
import { env } from '@my/todos';

export async function clear_db(target: 'todo-list'): MyDefinition {
  const response = await fetch(env.clear_db_url, { method: 'POST', body: target });
  if (response.status !== 200) {
    throw Error(`clear ${target} failed: ${response.statusText}`);
  }

  return def(`clear ${target} ok: ${response.statusText}`);
}
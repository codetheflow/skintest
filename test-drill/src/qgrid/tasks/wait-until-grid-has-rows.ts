import { has, I, perform, Task, task } from '@skintest/sdk';
import { $grid } from '../components/$grid';

/**
 * waits until grid has some rows
 * 
 * @returns task
 */
export async function wait_until_grid_has_rows(): Promise<Task> {
  return task(

    perform('wait for the first grid row'
      , I.wait($grid.row_at(0), has.state, 'visible')
    ),
    
  );
}
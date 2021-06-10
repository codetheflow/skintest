import { has, I, perform, Recipe, recipe } from '@skintest/sdk';
import { grid } from '../components/grid';

/**
 * waits until grid has some rows
 * 
 * @returns recipe
 */
export async function wait_until_grid_has_rows(): Promise<Recipe> {
  return recipe(
    perform('wait for the first grid row'
      , I.wait(grid.row_at(0), has.state, 'visible')
    )
  );
}
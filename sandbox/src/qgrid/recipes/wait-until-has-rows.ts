import { Recipe, recipe, wait } from '@skintest/sdk';
import { grid } from '../components/grid';

/**
 * waits until grid has some rows
 * 
 * @returns recipe
 */
export async function wait_until_has_rows(): Promise<Recipe> {
  return recipe(
    wait('exists', grid.row_at(0)),
  );
}
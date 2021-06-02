import { I, recipe } from '@skintest/sdk';
import * as path from 'path';
import { grid } from '../components/grid';

export const export_data_as = recipe.client(
  /**
   * waits for download completed after the click to the grid action
   * 
   * @param file_path export file path
   * @returns export data client recipe
   */
  async function (file_path: string) {
    const { page } = this;

    const ext = (
      path
        .extname(file_path)
        .split('.')
        .pop() || ''
    )
      .toUpperCase();

    // wait for the rows
    // todo: how to do it better, add network idle or check of the first row?
    await page.query(grid.row_at(0));
  
    return page
      .wait('download')
      .save(path.join(file_path))
      .when(`I click \`Export to ${ext}\` to download`
        , I.click(grid.action(`Export to ${ext}`))
      );
  }
);
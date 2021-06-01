import { I, recipe } from '@skintest/sdk';
import * as path from 'path';
import { grid } from '../components/grid';
import { env } from '../project/env';

export const export_data_as = recipe.client(
  /**
   * waits for download completed after the click to the grid action
   * 
   * @param file_name export file name
   * @returns download client recipe
   */
  async function (file_name: string) {
    const { page } = this;

    const ext = (
      path
        .extname(file_name)
        .split('.')
        .pop() || ''
    )
      .toUpperCase();

    // todo: add network idle or check of the first row?
    return page
      .wait('download')
      .save(path.join(env.downloads_path, file_name))
      .when(`I click \`Export to ${ext}\` to download`
        , I.click(grid.action(`Export to ${ext}`))
      );
  }
);
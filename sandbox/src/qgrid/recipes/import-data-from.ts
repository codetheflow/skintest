import { I, recipe } from '@skintest/sdk';
import { grid } from '../components/grid';

export const import_data_from = recipe.client(
  /**
   * waits for download completed after the click to the grid action
   * 
   * @param file_path import file path
   * @returns import data client recipe
   */
  async function (file_path: string) {
    const { page } = this;

    return page
      .wait('file-chooser')
      .open(file_path)
      .when(`I click \`Import file\``
        , I.click(grid.action(`Import file`))
      );
  }
);
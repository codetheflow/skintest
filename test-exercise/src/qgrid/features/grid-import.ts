import { feature, has, I } from '@skintest/sdk';
import { example_import } from '../components/example-import';
import { grid } from '../components/grid';
import { page } from '../components/page';
import { data } from '../project/data';
import { import_data_from } from '../recipes/import-data-from';

feature()

  .before('scenario'
    , I.open(page.start)
    , I.goto(example_import.url)
  )

  .scenario('check the import from csv button fills the grid'
    , I.do(import_data_from, data.atoms_csv_path)
    , I.check('grid has rows')
    , I.see(grid.row_at(0), has.state, 'visible')
    , I.see(grid.row_list, has.length, 50)
  )
import { named } from '@skintest/enterprise';
import { feature, has, I } from '@skintest/sdk';
import { $example_data_import } from '../components/$example-data-import';
import { $grid } from '../components/$grid';
import { assets } from '../project/assets';
import { import_data_from } from '../tasks/import-data-from';

feature()

  .before('scenario'
    , I.open('page', named.a)
    , I.goto($example_data_import.url)
  )

  .scenario('check the import from csv button fills the grid'
    , I.do(import_data_from, assets.atoms_csv_path)
    , I.check('grid has rows')
    , I.see($grid.row_at(0), has.state, 'visible')
    , I.see($grid.row_list, has.length, 50)
  );
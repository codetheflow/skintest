import { my } from '@skintest/enterprise';
import { feature, I } from '@skintest/sdk';
import { $example_data_export } from '../components/$example-data-export';
import { $page } from '../components/$page';
import { export_data_as } from '../tasks/export-data-as';
import { that_data_exists } from '../tasks/that-data-exists';
import { wait_until_grid_has_rows } from '../tasks/wait-until-grid-has-rows';

feature()

  .before('scenario'
    , I.open($page.start)
    , I.goto($example_data_export.url)
  )

  .scenario('check the export to csv button downloads the file'
    , I.do(wait_until_grid_has_rows)
    , I.do(export_data_as, my`data.csv`)
    , I.check('cvs file exists and contains data')
    , I.see(that_data_exists, my`data.csv`)
  );
import { my, named } from '@skintest/enterprise';
import { feature } from '@skintest/sdk';
import { I } from '../../actor';
import { that_data_exists } from '../claims/that-data-exists';
import { $example_data_export } from '../components/$example-data-export';
import { export_data_as } from '../tasks/export-data-as';
import { wait_until_grid_has_rows } from '../tasks/wait-until-grid-has-rows';

feature()

  .before('scenario'
    , I.open('page', named.a)
    , I.goto($example_data_export.url)
  )

  .scenario('check the export to csv button downloads the file'
    , I.do(wait_until_grid_has_rows)
    , I.do(export_data_as, my`data.csv`)
    , I.check('cvs file exists and contains data')
    , I.see(that_data_exists, my`data.csv`)
  );
import { feature, I } from '@skintest/sdk';
import { my } from 'packages/enterprise/src/my';
import { example_export } from '../components/example-export';
import { page } from '../components/page';
import { export_data_as } from '../recipes/export-data-as';
import { that_data_exists } from '../recipes/that-data-exists';
import { wait_until_grid_has_rows } from '../recipes/wait-until-grid-has-rows';

feature()

  .before('scenario'
    , I.open(page.start)
    , I.goto(example_export.url)
  )

  .scenario('check the export to csv button downloads the file'
    , I.do(wait_until_grid_has_rows)
    , I.do(export_data_as, my`data.csv`)
    , I.check('cvs file exists and contains data')
    , I.see(that_data_exists, my`data.csv`)
  )
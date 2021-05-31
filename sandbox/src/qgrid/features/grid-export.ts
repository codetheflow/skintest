import { feature, I } from '@skintest/sdk';
import { page } from '../components/page';
import { env } from '../project/env';
import { export_data_as } from '../recipes/export-data-as';
import { that_export_data_exists } from '../recipes/that-export-data-exists';

feature('grid export')
  .before('scenario'
    , I.open(page.start)
    , I.goto(env.export_url)
  )

  .scenario('check the export to csv button downloads the file'
    , I.do(export_data_as, 'data.csv')
    , I.test('cvs file exists and contains data')
    , I.see(that_export_data_exists, 'data.csv')
  )
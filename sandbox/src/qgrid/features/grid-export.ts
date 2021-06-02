import { feature, I } from '@skintest/sdk';
import { example_export } from '../components/example-export';
import { page } from '../components/page';
import { data } from '../project/data';
import { export_data_as } from '../recipes/export-data-as';
import { that_export_data_exists } from '../recipes/that-export-data-exists';

feature('grid export')
  .before('scenario'
    , I.open(page.start)
    , I.goto(example_export.url)
  )

  .scenario('check the export to csv button downloads the file'
    , I.do(export_data_as, data.downloads.data_csv_path)
    , I.test('cvs file exists and contains data')
    , I.see(that_export_data_exists, data.downloads.data_csv_path)
  )
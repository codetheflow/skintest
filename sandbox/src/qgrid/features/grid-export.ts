import { feature, has, I } from '@skintest/sdk';
import { grid } from '../components/grid';
import { page } from '../components/page';
import { env } from '../project/env';

feature('grid export')
  .before('scenario'
    , I.open(page.start)
    , I.goto(env.export_url)
  )

  .scenario('check the export csv button downloads the file'
    , I.click(grid.action('Export to CSV'))
    , I.test('cvs file contains data')
    , I.see(grid.action('Export to CSV'), has.state, 'exists')
  )
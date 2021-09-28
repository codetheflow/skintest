import { $, $$ } from '@skintest/web';

export const $grid = {
  row_list: $$<HTMLTableRowElement>`tr[q-grid-core-source="body"]`

  , row_at: (index: number) => $<HTMLTableRowElement>`tr[q-grid-core-source="body"]:nth-child(${index + 2})`
  , action: (text: string) => $<HTMLButtonElement>`.q-grid-action > button:has-text("${text}")`
};
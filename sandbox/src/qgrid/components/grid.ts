import { $ } from '@skintest/sdk';

export const grid = {
  action: (text: string) => $<HTMLButtonElement>`.q-grid-action > button:has-text("${text}")`,
  row_at: (index: number) => $<HTMLTableRowElement>`tr[q-grid-core-source="body"]:nth-child(${index + 2})`,
};
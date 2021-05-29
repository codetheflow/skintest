import { $ } from '@skintest/sdk';

export const grid = {
  action: (text: string) => $<HTMLButtonElement>`.q-grid-action > button:has-text("${text}")`,
};
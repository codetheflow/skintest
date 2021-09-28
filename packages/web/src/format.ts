import { qte } from '@skintest/common';

export function formatSelector(selector: string): string {
  if (selector && selector.indexOf(' ') >= 0) {
    return `${qte(selector)}`;
  }

  return selector;
}
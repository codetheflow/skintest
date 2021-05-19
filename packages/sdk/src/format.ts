export function formatSelector(selector: string): string {
  if (selector && selector.indexOf(' ') >= 0) {
    return `\`${selector}\``;
  }

  return selector;
}

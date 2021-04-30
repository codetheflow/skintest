export function formatSelector(query: string): string {
  if (query && query.indexOf(' ') >= 0) {
    return `\`${query}\``;
  }

  return query;
}

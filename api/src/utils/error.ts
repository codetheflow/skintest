export function error(name: string, message: string) {
  return new Error(`skintest.${name}: ${message}`);
}

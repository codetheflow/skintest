export function uuid(): string {
  function p8(s: boolean): string {
    const p = (Math.random().toString(16) + '000000000').substr(2, 8);
    return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
  }

  return p8(false) + p8(true) + p8(true) + p8(false);
}
const { stdout, stdin } = process;

const CURSOR_CODE = '\x1b[6n'
const CURSOR_PATTERN = /\[(\d+)\;(\d+)R$/;

export function getCursorPosition(): Promise<[number, number]> {
  return new Promise((resolve, reject) => {
    const isRaw = stdin.isRaw;
    stdin.setRawMode(true);

    stdin.once('data', data => {
      stdin.setRawMode(isRaw);

      console.log('MATCH?');
      const match = CURSOR_PATTERN.exec(data.toString());
      if (match) {
        const position = match.slice(1, 3).reverse().map(Number) as [number, number];
        console.log('MATCH');
        resolve(position);
      } else {
        // todo: better error message
        reject('can\'t find terminal cursor position');
      }
    });

    console.log('WRITE CURSOR CODE');
    stdout.write(CURSOR_CODE);
  });
}

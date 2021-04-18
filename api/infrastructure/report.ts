export function createReport(name: string) {
  return (name: string, message: string) => {
    console.log(`${name}: ${message}`);
  }
}
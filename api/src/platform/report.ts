export function createReport(name: string) {
  return (action: string, message: string) => {
    console.log(`${name}/I ${action}: ${message}`);
  }
}
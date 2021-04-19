export function createReport(name: string) {
  return (action: string, message?: string) => {
    if (message) {
      console.log(`${name}/I ${action}: ${message}`);
    } else {
      console.log(`${name}/I ${action}`);
    }
  }
}
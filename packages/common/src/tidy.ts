import { errors } from './errors';
import { isFunction, qte, reinterpret } from './utils';

type Resource =
  (() => void)
  | (() => Promise<unknown>)
  | { unsubscribe: () => void }
  | { run: () => void };

export class Tidy {
  private disposes: Array<() => Promise<void>> = [];

  add(resource: Resource): void {
    if ('run' in resource && isFunction(resource.run)) {
      this.disposes.push(async () => resource.run());
      return;
    }

    if ('unsubscribe' in resource && isFunction(resource.unsubscribe)) {
      this.disposes.push(async () => resource.unsubscribe());
      return;
    }

    if (isFunction(resource)) {
      this.disposes.push(async () => await reinterpret<() => Promise<void>>(resource)());
      return;
    }

    throw errors.invalidOperation(`resource ${qte('' + resource)} is not a tidy`);
  }

  async run(): Promise<void> {
    const temp = this.disposes;
    this.disposes = [];

    for (const dispose of temp) {
      await dispose();
    }
  }

  isEmpty(): boolean {
    return this.disposes.length === 0;
  }
}
import { Injectable, OnDestroy } from '@angular/core';
import { AppError } from './error';
import { isFunction } from './utils';

type Resource =
  (() => void)
  | { unsubscribe: () => void }
  | { run: () => void };

@Injectable()
export class Tidy implements OnDestroy {
  private disposes: Array<() => void> = [];

  add(resource: Resource): void {
    if ('run' in resource && isFunction(resource.run)) {
      this.disposes.push(() => resource.run());
      return;
    }

    if ('unsubscribe' in resource && isFunction(resource.unsubscribe)) {
      this.disposes.push(() => resource.unsubscribe());
      return;
    }

    if (isFunction(resource)) {
      this.disposes.push(resource as () => void);
      return;
    }

    throw new AppError(`resource "${resource}" is not a tidy`);
  }

  run() {
    const temp = this.disposes;
    this.disposes = [];

    for (const dispose of temp) {
      dispose();
    }
  }

  isEmpty() {
    return this.disposes.length === 0;
  }

  ngOnDestroy() {
    this.run();
  }
}

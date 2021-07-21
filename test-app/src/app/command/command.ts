import { EventEmitter } from '@angular/core';
import { noop, yes } from '../common/utils';

export interface CommandBody<T = void> {
  execute: (arg: T) => void;
  canExecute: (arg: T) => boolean;
  stopPropagate: boolean;
}

export class Command<T = void> {
  readonly canExecuteCheck = new EventEmitter();
  readonly stopPropagate: boolean;

  readonly execute: (arg: T) => void;
  readonly canExecute: (arg: T) => boolean;

  constructor(body: Partial<CommandBody<T>>) {
    this.stopPropagate = body.stopPropagate ?? true;
    this.execute = body.execute ?? noop;
    this.canExecute = body.canExecute ?? yes;
  }

  prob(arg: T): boolean {
    if (this.canExecute(arg) === true) {
      this.execute(arg);
      return true;
    }

    return false;
  }
}
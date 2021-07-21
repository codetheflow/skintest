/* eslint-disable @typescript-eslint/no-explicit-any */

export class AppError extends Error {
  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;

    // todo: get rid of any
    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }
}
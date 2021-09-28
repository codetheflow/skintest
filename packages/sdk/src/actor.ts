import { errors } from '@skintest/common';

type Ability<T> = { new(): T };

export interface Actor {
  who<A>(ability1: Ability<A>): A;
  who<A, B>(ability1: Ability<A>, ability2: Ability<B>): A & B;
  who<A, B, C>(ability1: Ability<A>, ability2: Ability<B>, ability3: Ability<C>,): A & B & C;
  who<A, B, C, D>(ability1: Ability<A>, ability2: Ability<B>, ability3: Ability<C>, ability4: D): A & B & C & D;
  who<A, B, C, D, E>(ability1: Ability<A>, ability2: Ability<B>, ability3: Ability<C>, ability4: Ability<D>, ability5: E): A & B & C & D & E;
  who<A, B, C, D, E, F>(ability1: Ability<A>, ability2: Ability<B>, ability3: Ability<C>, ability4: Ability<D>, ability5: Ability<E>, ability6: F): A & B & C & D & E & F;
  who<A, B, C, D, E, F, J>(ability1: Ability<A>, ability2: Ability<B>, ability3: Ability<C>, ability4: Ability<D>, ability5: Ability<E>, ability6: Ability<F>, ability7: J): A & B & C & D & E & F & J;
  who<A, B, C, D, E, F, J, H>(ability1: Ability<A>, ability2: Ability<B>, ability3: Ability<C>, ability4: Ability<D>, ability5: Ability<E>, ability6: Ability<F>, ability7: Ability<J>, ability8: Ability<H>): A & B & C & D & E & F & J & H;
}

export const actor: Actor = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  who<T extends Ability<any>[]>(...abilities: T): unknown {
    if (!abilities.length) {
      throw errors.invalidOperation('actor requires at least one ability');
    }

    const { hasOwnProperty } = Object.prototype;
    const xs = abilities.map(x => new x());
    const { length } = xs;

    const handler = {
      get: function (target: unknown[], key: string) {
        for (let i = 0; i < length; i++) {
          const x = xs[i];
          if (hasOwnProperty.call(x, key)) {
            return x[key];
          }
        }

        throw errors.invalidOperation(`can't find method ${key} in the abilities`);
      }
    };

    return new Proxy(xs, handler);
  }
};
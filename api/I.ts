import { MyStep } from './my-step';
import { Selector } from './selector';

export abstract class I {
  static do(x: any): MyStep { throw new Error('not implemented'); };

  static amOnPage(url: string): MyStep { throw new Error('not implemented'); };
  static waitUrl(url: string): MyStep { throw new Error('not implemented'); };

  static click<S>(target: Selector<S>): MyStep { throw new Error('not implemented'); };
  static press(key: string): MyStep { throw new Error('not implemented'); };
  static fill<S, V>(target: Selector<S>, value: V): MyStep { throw new Error('not implemented'); };
  static focus<S>(target: S): MyStep { throw new Error('not implemented'); };

  // TODO: define file type
  static attachFile(from: Selector<HTMLFormElement>, file: any): MyStep { throw new Error('not implemented'); };

  static see<S, E>(target: Selector<S> | boolean, expected?: E): MyStep { throw new Error('not implemented'); };
  static dontSee<S, E>(target: Selector<S> | boolean, expected?: E): MyStep { throw new Error('not implemented'); };

  static say(message: string): MyStep { throw new Error('not implemented'); };
}
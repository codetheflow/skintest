import { Guard, reinterpret } from '@skintest/common';
import { Feature, schema, StrictFeature } from './schema';
import { Script } from './script';
import { getSuite } from './suite';

export function feature<S extends Feature = StrictFeature>(pattern?: S): S {
  const suite = getSuite();

  // todo: make error from errors
  Guard.notNull(
    suite,
    `suite is not defined, make sure that you are running tests by using skintest platform() function`
  );

  if (!pattern) {
    pattern = schema.strict as S;
  }

  suite.addScript(reinterpret<Script>(pattern));
  return pattern;
}
import { actor, CanWriteScenarios } from '@skintest/sdk';
import { CanBrowseTheWeb } from '@skintest/web';

export const I = actor.who(
  CanWriteScenarios,
  CanBrowseTheWeb,
);

export type Actor = typeof I;
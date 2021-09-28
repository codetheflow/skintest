import { mixin } from '@skintest/common';
import { CanCheck } from './can-check';
import { CanDo } from './can-do';
import { CanPause } from './can-pause';
import { CanSay } from './can-say';
import { CanSee } from './can-see';

export class CanWriteScenarios { }
export interface CanWriteScenarios extends CanPause, CanDo, CanSay, CanCheck, CanSee { }

mixin(CanWriteScenarios, [CanPause, CanDo, CanSay, CanCheck, CanSee]);
import { Browser } from './browser';
import { ClientRecipe, ServerRecipe } from './recipe';
import { Meta } from './reflect';
import { TestExecutionResult } from './test-result';

export interface StepContext {
  browser: Browser;
}

export type Command =
  ClientStep
  | TestStep
  | AssertStep
  | DevStep
  | InfoStep
  | DoStep;

export interface CommandBody {
  execute(context: StepContext): Promise<TestExecutionResult>;
  toString(): string;
  meta: Promise<Meta>;
}

export interface ClientStep extends CommandBody {
  type: 'client';
}

export interface TestStep extends CommandBody {
  type: 'test';
}

export interface AssertStep extends CommandBody {
  type: 'assert';
}

export interface DevStep extends CommandBody {
  type: 'dev';
}

export interface InfoStep extends CommandBody {
  type: 'info';
}

export interface DoStep extends CommandBody {
  type: 'do';
  recipe: ClientRecipe<any> | ServerRecipe<any>;
  args: any[];
}

export async function getMessage(command: Command): Promise<string> {
  try {
    const meta = await command.meta;
    return meta.code;
  } catch {
    return command.toString();
  }
}

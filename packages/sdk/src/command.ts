import { Meta } from '@skintest/common';
import { Browser } from './browser';
import { RecipeFunction } from './recipe';
import { RepeatWrite } from './repeat';
import { InspectInfo, TestResult } from './test-result';

export type Command =
  AssertStep<unknown>
  | ControlStep<unknown>
  | DataStep<unknown>
  | DevStep<unknown>
  | DoStep<unknown>
  | InfoStep<unknown>
  | CheckStep<unknown>
  | ClientStep<unknown>;

export interface StepContext {
  browser: Browser;
}

export type StepExecutionResult =
  StepExecutionConditionResult
  | StepExecutionEventResult
  | StepExecutionInspectResult
  | StepExecutionMethodResult
  | StepExecutionPerformResult
  | StepExecutionRecipeResult
  | StepExecutionRepeatResult
  | StepExecutionAssertResult;

export type StepExecutionInspectResult = {
  type: 'inspect',
  info: InspectInfo,
}

export type StepExecutionAssertResult = {
  type: 'assert',
  result: TestResult,
}

export type StepExecutionMethodResult = {
  type: 'method',
}

export type StepExecutionPerformResult = {
  type: 'perform',
  plan: Command[],
}

export type StepExecutionRecipeResult = {
  type: 'recipe',
  plan: Command[],
}

export type StepExecutionEventResult = {
  type: 'event',
  handler: Command,
  trigger: Command[],
}

export type StepExecutionRepeatResult = {
  type: 'repeat',
  till: Command[],
  plan: Command[],
  writes: RepeatWrite[],
}

export type StepExecutionConditionResult = {
  type: 'condition',
  cause: Command[],
  plan: Command[],
}

export interface CommandBody<D> {
  token?: D;

  execute(context: StepContext): Promise<StepExecutionResult>;
  getMeta(): Promise<Meta>;
  toString(): string;
}

export interface ClientStep<D> extends CommandBody<D> {
  type: 'client';
}

export interface CheckStep<D> extends CommandBody<D> {
  type: 'check';
}

export interface AssertStep<D> extends CommandBody<D> {
  type: 'assert';
}

export interface DevStep<D> extends CommandBody<D> {
  type: 'dev';
}

export interface InfoStep<D> extends CommandBody<D> {
  type: 'info';
}

export interface DoStep<D> extends CommandBody<D> {
  type: 'do';
  recipe: RecipeFunction,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any[],
}

export interface ControlStep<D> extends CommandBody<D> {
  type: 'control';
}

export interface DataStep<D> extends CommandBody<D> {
  type: 'data';
}

export async function methodResult(promise: Promise<void>): Promise<StepExecutionResult> {
  await promise;

  // if there were no exception return `ok`
  return {
    type: 'method',
  };
}
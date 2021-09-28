import { Meta } from '@skintest/common';
import { RepeatWrite } from './repeat';
import { Steps } from './script';
import { TaskFunction } from './task';
import { TestResult } from './test-result';
import { Value } from './value';

export type Command<D = unknown> =
  AssertStep<D>
  | ControlStep<D>
  | DevStep<D>
  | DoStep<D>
  | InfoStep<D>
  | CheckStep<D>
  | ClientStep<D>;

export interface StepContext {
  materialize<V, D>(value: Value<V, D>): V;
}

export type StepExecutionResult =
  StepExecutionConditionResult
  | StepExecutionEventResult
  | StepExecutionMethodResult
  | StepExecutionPerformResult
  | StepExecutionTaskResult
  | StepExecutionRepeatResult
  | StepExecutionAssertResult;

export type StepExecutionAssertResult = {
  type: 'assert',
  result: TestResult,
}

export type StepExecutionMethodResult = {
  type: 'method',
}

export type StepExecutionPerformResult = {
  type: 'perform',
  body: Steps,
}

export type StepExecutionTaskResult = {
  type: 'task',
  body: Steps,
}

export type StepExecutionEventResult = {
  type: 'event',
  handler: Steps,
  trigger: Steps,
}

export type StepExecutionRepeatResult = {
  type: 'repeat',
  till: Steps,
  body: Steps,
  writes: RepeatWrite[],
}

export type StepExecutionConditionResult = {
  type: 'condition',
  cause: Steps,
  body: Steps,
}

export interface CommandBody<D> {
  token?: D;

  execute(context: StepContext): Promise<StepExecutionResult>;

  /**
   * Calculates only once
   */
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
  task: TaskFunction,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any[],
}

export interface ControlStep<D> extends CommandBody<D> {
  type: 'control';
}

export async function methodResult(promise: Promise<void>): Promise<StepExecutionResult> {
  await promise;

  // if there were no exception return `ok`
  return {
    type: 'method',
  };
}
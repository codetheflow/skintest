import { Meta } from '@skintest/common';
import { Browser } from './browser';
import { RepeatWrite } from './repeat';
import { Steps } from './script';
import { TaskFunction } from './task';
import { InspectInfo, TestResult } from './test-result';
import { Value } from './value';

export type Command<T = unknown> =
  AssertStep<T>
  | ControlStep<T>
  | DevStep<T>
  | DoStep<T>
  | InfoStep<T>
  | CheckStep<T>
  | ClientStep<T>;

export interface StepContext {
  browser: Browser;
  materialize<V, D>(value: Value<V, D>): V;
}

export type StepExecutionResult =
  StepExecutionConditionResult
  | StepExecutionEventResult
  | StepExecutionInspectResult
  | StepExecutionMethodResult
  | StepExecutionPerformResult
  | StepExecutionTaskResult
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
  plan: Steps,
}

export type StepExecutionTaskResult = {
  type: 'task',
  plan: Steps,
}

export type StepExecutionEventResult = {
  type: 'event',
  handler: Steps,
  trigger: Steps,
}

export type StepExecutionRepeatResult = {
  type: 'repeat',
  till: Steps,
  plan: Steps,
  writes: RepeatWrite[],
}

export type StepExecutionConditionResult = {
  type: 'condition',
  cause: Steps,
  plan: Steps,
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
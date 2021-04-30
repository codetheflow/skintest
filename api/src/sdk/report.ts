import { TestFail, InspectInfo } from './test-result';

export interface Report {
  beforeFeature(name: string): StatusReport;
  beforeScenario(name: string): StatusReport;
  beforeStep(name: string): StatusReport;

  step(name: string): StatusReport;

  afterFeature(name: string): StatusReport;
  afterScenario(name: string): StatusReport;
  afterStep(name: string): StatusReport;

  attempt(): StatusReport;

  say(message: string): StatusReport;

  debug(name: string): StatusReport;
  inspect(info: InspectInfo): InspectReport
}

export interface StatusReport {
  pass(): void;
  fail(reason: TestFail): void;
  error(ex: Error): void;
}

export type InspectReport = Promise<void>;
import { TestFail } from './test-result';

export interface Report {
  feature(name: string): StatusReport;

  beforeFeature(name: string): StatusReport;
  beforeScenario(name: string): StatusReport;
  beforeStep(name: string): StatusReport;

  step(name: string): StatusReport;

  afterFeature(name: string): StatusReport;
  afterScenario(name: string): StatusReport;
  afterStep(name: string): StatusReport;

  attempt(): StatusReport;
}

export interface StatusReport {
  pass(): void;
  fail(reason: TestFail): void;
  error(ex: Error): void;
}
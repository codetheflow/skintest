import { TestFail, InspectInfo } from './test-result';

export interface Report {
  beforeFeature(name: string): StatusReport;
  beforeScenario(name: string): StatusReport;
  beforeStep(name: string): StatusReport;

  ui(name: string): StatusReport;
  assert(name: string): StatusReport;
  check(what: string): StatusReport;

  afterFeature(name: string): StatusReport;
  afterScenario(name: string): StatusReport;
  afterStep(name: string): StatusReport;

  attempt(): StatusReport;

  say(message: string): StatusReport;

  dev(name: string): StatusReport;
  inspect(info: InspectInfo): InspectReport
}

export interface StatusReport {
  pass(): void;
  fail(reason: TestFail): void;
  error(ex: Error): void;
}

export type InspectReport = Promise<void>;
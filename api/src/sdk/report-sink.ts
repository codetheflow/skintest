import { TestFail, InspectInfo } from './test-result';

export interface StatusReport {
  pass(): Promise<void>;
  fail(reason: TestFail): Promise<void>;
  error(ex: Error): Promise<void>;
  progress(message: string): Promise<void>;
  inspect(info: InspectInfo): Promise<void>
}

export type ReportFeatureContext = { feature: string; };
export type ReportScenarioContext = ReportFeatureContext & { scenario: string };
export type ReportStepContext = ReportScenarioContext & { step: string };

export interface ReportSink {
  start(): Promise<Reporting>;
  end(reporting: Reporting): Promise<void>;
}

export interface Reporting {
  beforeFeature(context: ReportFeatureContext): Promise<StatusReport>;
  beforeScenario(context: ReportScenarioContext): Promise<StatusReport>;
  beforeStep(context: ReportStepContext): Promise<StatusReport>;

  assert(context: ReportStepContext): Promise<StatusReport>;
  check(context: ReportStepContext): Promise<StatusReport>;

  afterFeature(context: ReportFeatureContext): Promise<StatusReport>;
  afterScenario(context: ReportScenarioContext): Promise<StatusReport>;
  afterStep(context: ReportStepContext): Promise<StatusReport>;

  attempt(): Promise<StatusReport>;

  info(context: ReportStepContext): Promise<StatusReport>;
  dev(context: ReportStepContext): Promise<StatusReport>;
  do(context: ReportStepContext): Promise<StatusReport>;
  client(context: ReportStepContext): Promise<StatusReport>;
}

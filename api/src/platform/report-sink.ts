import { TestFail, InspectInfo } from '../sdk/test-result';

export interface StatusReport {
  pass(): Promise<void>;
  fail(reason: TestFail): Promise<void>;
  error(ex: Error): Promise<void>;
  progress(message: string): Promise<void>;
  inspect(info: InspectInfo): Promise<void>
}

export type ReportFeatureMessage = { feature: string; };
export type ReportScenarioMessage = ReportFeatureMessage & { scenario: string };
export type ReportStepMessage = ReportScenarioMessage & { step: string };

export interface ReportSink {
  start(): Promise<Reporting>;
  end(reporting: Reporting): Promise<void>;
}

export interface Reporting {
  beforeFeature(message: ReportFeatureMessage): Promise<StatusReport>;
  beforeScenario(message: ReportScenarioMessage): Promise<StatusReport>;
  beforeStep(message: ReportStepMessage): Promise<StatusReport>;

  assert(message: ReportStepMessage): Promise<StatusReport>;
  check(message: ReportStepMessage): Promise<StatusReport>;

  afterFeature(message: ReportFeatureMessage): Promise<StatusReport>;
  afterScenario(message: ReportScenarioMessage): Promise<StatusReport>;
  afterStep(message: ReportStepMessage): Promise<StatusReport>;

  attempt(): Promise<StatusReport>;

  info(message: ReportStepMessage): Promise<StatusReport>;
  dev(message: ReportStepMessage): Promise<StatusReport>;
  do(message: ReportStepMessage): Promise<StatusReport>;
  client(message: ReportStepMessage): Promise<StatusReport>;
}

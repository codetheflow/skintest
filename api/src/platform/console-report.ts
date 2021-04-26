import { Report, StatusReport } from '../integration/report';
import { TestFail } from '../integration/test-result';

export class ConsoleReport implements Report {
  step(name: string): StatusReport {
    return new ConsoleStepReport(name);
  }

  feature(name: string): StatusReport {
    return new ConsoleStepReport(name);
  }
  
  beforeFeature(name: string): StatusReport {
    return new ConsoleStepReport(name);
  }
  
  beforeScenario(name: string): StatusReport {
    return new ConsoleStepReport(name);
  }
  
  beforeStep(name: string): StatusReport {
    return new ConsoleStepReport(name);
  }
  
  afterFeature(name: string): StatusReport {
    return new ConsoleStepReport(name);
  }
  
  afterScenario(name: string): StatusReport {
    return new ConsoleStepReport(name);
  }
  
  afterStep(name: string): StatusReport {
    return new ConsoleStepReport(name);
  }

  attempt(): StatusReport {
    return new ConsoleStepReport('attempt');
  }
}

class ConsoleStepReport implements StatusReport {
  constructor(private name: string) {
  }

  pass(): void {
    console.log(`${this.name} - pass`);
  }

  fail(reason: TestFail): void {
    console.error(reason.description);
  }

  error(ex: Error): void {
    console.error(ex);
  }

}
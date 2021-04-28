import { Report, StatusReport } from '../integration/report';
import { TestFail } from '../integration/test-result';
import * as chalk from 'chalk';

const { stdout, stderr } = process;

export class NodeReport implements Report {
  step(name: string): StatusReport {
    return new StepReport(name);
  }

  beforeFeature(name: string): StatusReport {
    return new BeforeFeatureReport(name);
  }

  beforeScenario(name: string): StatusReport {
    return new BeforeScenarioReport(name);
  }

  beforeStep(name: string): StatusReport {
    return new ShowOnlyErrorReport(name);
  }

  afterFeature(name: string): StatusReport {
    return new AfterFeatureReport(name);
  }

  afterScenario(name: string): StatusReport {
    return new ShowOnlyErrorReport(name);
  }

  afterStep(name: string): StatusReport {
    return new ShowOnlyErrorReport(name);
  }

  attempt(): StatusReport {
    return new ShowOnlyErrorReport('attempt');
  }
}

class StepReport implements StatusReport {
  private readonly ident = '    ';
  constructor(private doSomething: string) {
    stdout.write(this.ident + ` I ${doSomething}`);
  }

  pass(): void {
    stdout.clearLine(-1);
    stdout.cursorTo(0);
    stdout.write(this.ident + chalk.green('\u2713') + ` I ${this.doSomething}\n`);
  }

  fail(reason: TestFail): void {
    stdout.clearLine(-1);
    stdout.cursorTo(0);
    stdout.write(this.ident + chalk.white.bgRed(`I ${this.doSomething}\n`));
    stderr.write(this.ident + '  ' + chalk.yellow(`${reason.description}. ${reason.solution}\n`));
  }

  error(ex: Error): void {
    console.error(ex);
  }
}

class ShowOnlyErrorReport implements StatusReport {
  constructor(name: string) {
  }

  pass(): void {
  }

  fail(reason: TestFail): void {
  }

  error(ex: Error): void {
    console.error(ex);
  }
}

class BeforeFeatureReport extends ShowOnlyErrorReport {
  constructor(name: string) {
    super(name);
    stdout.write(chalk.bold(`\nfeature "${name}"\n`));
  }
}

class AfterFeatureReport extends ShowOnlyErrorReport {
  constructor(name: string) {
    super(name);
    stdout.write(`\n`);
  }
}

class BeforeScenarioReport extends ShowOnlyErrorReport {
  private readonly ident = '  ';

  constructor(name: string) {
    super(name);
    stdout.write(chalk.whiteBright('\n' + this.ident + `scenario "${name}"\n`));
  }
}

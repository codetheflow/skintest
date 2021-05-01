import { InspectReport, Report, ReportFeatureContext, ReportScenarioContext, ReportStepContext, StatusReport } from '../sdk/report';
import { TestFail, InspectInfo } from '../sdk/test-result';
import * as chalk from 'chalk';

const { stdout, stderr } = process;

const CHECK_MARK = '\u2713';
const CROSS_MARK = '\u2613';
const NEW_LINE = '\n';
const WS = ' ';

export class NodeReport implements Report {
  assert(context: ReportStepContext): StatusReport {
    return new StepReport(context.step);
  }

  check(context: ReportStepContext): StatusReport {
    return new InfoReport(context.step);
  }

  say(context: ReportStepContext): StatusReport {
    return new InfoReport(context.step);
  }

  ui(context: ReportStepContext): StatusReport {
    return new StepReport(context.step);
  }

  beforeFeature(context: ReportFeatureContext): StatusReport {
    return new ErrorReport();
  }

  beforeScenario(context: ReportScenarioContext): StatusReport {
    return new BeforeScenarioReport(context.feature, context.scenario);
  }

  beforeStep(context: ReportStepContext): StatusReport {
    return new ErrorReport();
  }

  afterFeature(context: ReportFeatureContext): StatusReport {
    return new ErrorReport();
  }

  afterScenario(context: ReportScenarioContext): StatusReport {
    return new ErrorReport();
  }

  afterStep(context: ReportStepContext): StatusReport {
    return new ErrorReport();
  }

  attempt(): StatusReport {
    return new ErrorReport();
  }

  dev(context: ReportStepContext): StatusReport {
    return new DebugReport(context.step);
  }

  async inspect(info: InspectInfo): InspectReport {
    let { query, target } = info;

    stdout.write(NEW_LINE);

    const textForTable = (text: string): string => {
      if (!text) {
        return text;
      }

      const MAX_LENGTH = 40;
      if (text.length < MAX_LENGTH) {
        return text;
      }

      return text.substring(0, MAX_LENGTH) + '...';
    };

    if (Array.isArray(target)) {
      if (target.length > 1) {
        stdout.write(`$(\`${query}\`) found ${target.length} elements`);
        stdout.write(NEW_LINE);

        const list: any[] = [];
        for (const element of target) {
          const text = textForTable(await element.innerText());
          list.push({
            innerText: text
          });
        }

        console.table(list);
        return;
      }

      target = target[0];
    }

    if (target) {
      stdout.write(`$(\`${query}\`) found 1 element`);
      stdout.write(NEW_LINE);

      console.table({
        innerText: textForTable(await target.innerText())
      });

      return;
    }

    stdout.write(chalk.bgRed(`$(\`${query}\`) didn't find any elements`));
    stdout.write(NEW_LINE);
  }
}

class ErrorReport implements StatusReport {
  pass(): void {
  }

  fail(reason: TestFail): void {
    console.error(reason.description);
  }

  error(ex: Error): void {
    console.error(ex);
  }
}


class DebugReport extends ErrorReport {
  constructor(name: string) {
    super();

    stdout.write(NEW_LINE);
    stdout.write(chalk.yellow(name));
    stdout.write(NEW_LINE);
  }

  pass(): void {
    stdout.write(chalk.yellow(NEW_LINE));
  }

  fail(reason: TestFail): void {
    stdout.write(chalk.yellow(NEW_LINE));
  }

  error(ex: Error): void {
    throw ex;
  }
}

class InfoReport extends ErrorReport {
  constructor(step: string) {
    super();

    stdout.write(chalk.hidden(CHECK_MARK));
    stdout.write(WS);
    stdout.write(chalk.italic(step));
  }

  pass(): void {
    stdout.write(NEW_LINE);
  }
}

class StepReport extends ErrorReport {
  constructor(private step: string) {
    super();

    stdout.write(chalk.hidden(CHECK_MARK));
    stdout.write(WS);
    stdout.write(chalk.grey(step));
  }

  pass(): void {
    stdout.clearLine(-1);
    stdout.cursorTo(0);

    stdout.write(chalk.green(CHECK_MARK));
    stdout.write(WS);
    stdout.write(chalk.grey(this.step));
    stdout.write(NEW_LINE);
  }

  fail(reason: TestFail): void {
    stderr.clearLine(-1);
    stderr.cursorTo(0);

    stderr.write(chalk.red(CROSS_MARK));
    stderr.write(WS)
    stderr.write(chalk.gray(this.step));
    stderr.write(NEW_LINE);

    stderr.write(chalk.hidden(CROSS_MARK));
    stderr.write(WS);
    stderr.write(chalk.bgRedBright.white(reason.description));
    stderr.write(NEW_LINE);
  }
}

class BeforeScenarioReport extends ErrorReport {
  constructor(feature: string, scenario: string) {
    super();

    stdout.write(NEW_LINE);
    stdout.write(chalk.whiteBright.bold(`${feature}`) + '\\' + chalk.whiteBright(scenario));
    stdout.write(NEW_LINE);
  }
}

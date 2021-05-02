import { Report, ReportFeatureContext, ReportScenarioContext, ReportStepContext, StatusReport } from '../sdk/report';
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
    return new NewLineReport()
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
    return new NewLineReport();
  }

  afterStep(context: ReportStepContext): StatusReport {
    return new ErrorReport();
  }

  attempt(): StatusReport {
    return new EmptyReport();
  }

  dev(context: ReportStepContext): StatusReport {
    return new DebugReport(context.step);
  }
}

class ErrorReport implements StatusReport {
  async pass(): Promise<void> {
  }

  async fail(reason: TestFail): Promise<void> {
    stderr.write(chalk.hidden(CROSS_MARK));
    stderr.write(WS);
    stderr.write(chalk.bgRedBright.white(reason.description));
    stderr.write(NEW_LINE);
  }

  async error(ex: Error): Promise<void> {
    if (ex.stack) {
      stderr.write(chalk.red(ex.stack));
    } else {
      stderr.write(chalk.bgRed(`${ex.name}: ${ex.message}`));
    }

    stderr.write(NEW_LINE);
  }

  async inspect(info: InspectInfo): Promise<void> {
    let { selector: query, target } = info;


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

class DebugReport extends ErrorReport {
  constructor(name: string) {
    super();

    stdout.write(chalk.yellow(name));
    stdout.write(NEW_LINE);
  }
}

class InfoReport extends ErrorReport {
  constructor(step: string) {
    super();

    stdout.write(chalk.hidden(CHECK_MARK));
    stdout.write(WS);
    stdout.write(chalk.italic(step));
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

  async pass(): Promise<void> {
    stdout.clearLine(-1);
    stdout.cursorTo(0);

    stdout.write(chalk.green(CHECK_MARK));
    stdout.write(WS);
    stdout.write(chalk.grey(this.step));
    stdout.write(NEW_LINE);
  }

  async fail(reason: TestFail): Promise<void> {
    stderr.clearLine(-1);
    stderr.cursorTo(0);

    stderr.write(chalk.red(CROSS_MARK));
    stderr.write(WS)
    stderr.write(chalk.gray(this.step));
    stderr.write(NEW_LINE);

    return super.fail(reason);
  }

  async error(ex: Error): Promise<void> {
    stderr.clearLine(-1);
    stderr.cursorTo(0);

    stderr.write(chalk.red(CROSS_MARK));
    stderr.write(WS)
    stderr.write(chalk.gray(this.step));
    stderr.write(NEW_LINE);

    return super.error(ex);
  }
}

class BeforeScenarioReport extends ErrorReport {
  constructor(feature: string, scenario: string) {
    super();

    stdout.write(chalk.whiteBright.bold(`${feature}`) + '\\' + chalk.whiteBright(scenario));
    stdout.write(NEW_LINE);
  }
}

class NewLineReport extends ErrorReport {
  constructor() {
    super();

    stdout.write(NEW_LINE);
  }
}


class EmptyReport implements StatusReport {
  async pass(): Promise<void> {
  }

  async fail(reason: TestFail): Promise<void> {
  }

  async error(ex: Error): Promise<void> {
  }

  async inspect(info: InspectInfo): Promise<void> {

  }
}
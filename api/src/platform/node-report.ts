import { InspectReport, Report, StatusReport } from '../sdk/report';
import { TestFail, InspectInfo } from '../sdk/test-result';
import * as chalk from 'chalk';

const { stdout, stderr } = process;

const CHECK_MARK = '\u2713';
const NEW_LINE = '\n';

export class NodeReport implements Report {
  assert(name: string): StatusReport {
    return new AssertReport(name);
  }

  check(what: string): StatusReport {
    return new CheckReport(what);
  }

  say(message: string): StatusReport {
    return new SayReport(message);
  }

  ui(name: string): StatusReport {
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

  dev(name: string): StatusReport {
    return new DebugReport(name);
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

class DebugReport implements StatusReport {
  constructor(name: string) {
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

class CheckReport implements StatusReport {
  private readonly ident = '    ';

  constructor(what: string) {
    stdout.write(this.ident);
    stdout.write(chalk.hidden(CHECK_MARK) + ` I ${what}`);
    stdout.write(NEW_LINE);
  }

  pass(): void {
  }

  fail(reason: TestFail): void {
    // TODO: make it red?
  }

  error(ex: Error): void {
    console.error(ex);
  }
}

class SayReport implements StatusReport {
  private readonly ident = '    ';

  constructor(message: string) {
    stdout.write(this.ident);
    stdout.write(chalk.hidden(CHECK_MARK) + chalk.italic(` I ${message}`));
  }

  pass(): void {
    stdout.write(NEW_LINE);
  }

  fail(reason: TestFail): void {
    stdout.write(NEW_LINE);
  }

  error(ex: Error): void {
    console.error(ex);
  }
}

class StepReport implements StatusReport {
  private readonly ident = '    ';
  constructor(private doSomething: string) {
    stdout.write(this.ident);
    stdout.write(chalk.grey(` I ${doSomething}`));
  }

  pass(): void {
    stdout.clearLine(-1);
    stdout.cursorTo(0);

    stdout.write(this.ident);
    stdout.write(chalk.green(CHECK_MARK));
    stdout.write(chalk.grey(` I ${this.doSomething}`));
    stdout.write(NEW_LINE);
  }

  fail(reason: TestFail): void {
    stdout.clearLine(-1);
    stdout.cursorTo(0);

    stdout.write(this.ident);
    stdout.write(chalk.white.bgRed(`I ${this.doSomething}`));
    stdout.write(NEW_LINE);

    stderr.write(this.ident + ' ');
    stderr.write(chalk.yellow(`${reason.description}. ${reason.solution}`));
    stderr.write(NEW_LINE);
  }

  error(ex: Error): void {
    console.error(ex);
  }
}

class AssertReport implements StatusReport {
  private readonly ident = '        ';

  constructor(private assert: string) {
    stdout.write(this.ident);
    stdout.write(chalk.grey(assert));
  }

  pass(): void {
    stdout.clearLine(-1);
    stdout.cursorTo(0);

    stdout.write(this.ident);
    stdout.write(chalk.green(CHECK_MARK));
    stdout.write(chalk.grey(this.assert));
    stdout.write(NEW_LINE);
  }

  fail(reason: TestFail): void {
    stdout.clearLine(-1);
    stdout.cursorTo(0);

    stdout.write(this.ident);
    stderr.write(chalk.white.red(this.assert) + ', ' + chalk.red(`${reason.description}`));
    stderr.write(NEW_LINE);
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

    stdout.write(NEW_LINE);
    stdout.write(chalk.bold(`feature \`${name}\``))
    stdout.write(NEW_LINE);
  }
}

class AfterFeatureReport extends ShowOnlyErrorReport {
  constructor(name: string) {
    super(name);
    stdout.write(NEW_LINE);
  }
}

class BeforeScenarioReport extends ShowOnlyErrorReport {
  private readonly ident = '  ';

  constructor(name: string) {
    super(name);

    stdout.write(NEW_LINE);
    stdout.write(this.ident);
    stdout.write(chalk.whiteBright(`scenario \`${name}\``));
    stdout.write(NEW_LINE);
  }
}

import * as chalk from 'chalk';
import { InspectInfo, TestFail } from '../sdk/test-result';
import { ReportFeatureMessage, Reporting, ReportScenarioMessage, ReportSink, ReportStepMessage, StatusReport } from './report-sink';

const { stdout, stderr } = process;

const CHECK_MARK = '\u2713';
const CROSS_MARK = '\u2613';
const NEW_LINE = '\n';
const WS = ' ';

async function createLine() {
  // const [x, y] = await getCursorPosition();
  // todo: use getCursorPosition
  return (...text: string[]) => {
    stdout.cursorTo(0);
    stdout.clearScreenDown();

    const line = text.join('');
    if (line.length > stdout.columns) {
      // todo: make it better
      if (line[line.length - 1] === NEW_LINE) {
        stdout.write(line.substring(0, stdout.columns - 4) + '...' + chalk.white(NEW_LINE));
      } else {
        stdout.write(line.substring(0, stdout.columns - 3) + '...');
      }
    } else {
      stdout.write(line);
    }
  }
}

export class NodeReportSink implements ReportSink {
  start(): Promise<Reporting> {
    return Promise.resolve(new NodeReporting);
  }

  end(report: Reporting): Promise<void> {
    return Promise.resolve();
  }
}

class NodeReporting implements Reporting {
  assert(message: ReportStepMessage): Promise<StatusReport> {
    return stepReport(message.step);
  }

  test(message: ReportStepMessage): Promise<StatusReport> {
    return infoReport(message.step);
  }

  info(message: ReportStepMessage): Promise<StatusReport> {
    return infoReport(message.step);
  }

  client(message: ReportStepMessage): Promise<StatusReport> {
    return stepReport(message.step);
  }

  beforeFeature(message: ReportFeatureMessage): Promise<StatusReport> {
    return catchReport()
  }

  beforeScenario(message: ReportScenarioMessage): Promise<StatusReport> {
    return beforeScenarioReport(message.feature, message.scenario);
  }

  beforeStep(message: ReportStepMessage): Promise<StatusReport> {
    return catchReport();
  }

  afterFeature(message: ReportFeatureMessage): Promise<StatusReport> {
    return catchReport();
  }

  afterScenario(message: ReportScenarioMessage): Promise<StatusReport> {
    return catchReport();
  }

  afterStep(message: ReportStepMessage): Promise<StatusReport> {
    return catchReport();
  }

  attempt(): Promise<StatusReport> {
    return emptyReport();
  }

  dev(message: ReportStepMessage): Promise<StatusReport> {
    return devReport(message.step);
  }

  do(message: ReportStepMessage): Promise<StatusReport> {
    return doReport(message.step);
  }
}

export async function catchReport(): Promise<StatusReport> {
  return {
    async pass(): Promise<void> {
    },

    async progress(message: string): Promise<void> {
    },

    async fail(reason: TestFail): Promise<void> {
      stderr.write(chalk.hidden(CROSS_MARK));
      stderr.write(WS);
      stderr.write(chalk.bgRedBright.white(reason.description));
      stderr.write(NEW_LINE);
    },

    async error(ex: Error): Promise<void> {
      if (ex.stack) {
        stderr.write(chalk.red(ex.stack));
      } else {
        stderr.write(chalk.bgRed(`${ex.name}: ${ex.message}`));
      }

      stderr.write(NEW_LINE);
    },

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
    },
  };
}

function devReport(message: string): Promise<StatusReport> {
  stdout.write(chalk.yellow(message));
  stdout.write(NEW_LINE);
  return catchReport();
}

function infoReport(message: string): Promise<StatusReport> {
  stdout.write(chalk.hidden(CHECK_MARK));
  stdout.write(WS);
  stdout.write(chalk.grey(message));
  stdout.write(NEW_LINE);
  return catchReport();
}

async function stepReport(message: string): Promise<StatusReport> {
  const firstLine = await createLine();
  const status = await catchReport();
  firstLine(chalk.hidden(CHECK_MARK), WS, chalk.grey(message))

  return {
    ...status,

    async pass(): Promise<void> {
      firstLine(chalk.green(CHECK_MARK), WS, chalk.grey(message), NEW_LINE);
      return status.pass();
    },

    async fail(reason: TestFail): Promise<void> {
      firstLine(chalk.red(CROSS_MARK), WS, chalk.gray(message), NEW_LINE);
      return status.fail(reason);
    },

    async error(ex: Error): Promise<void> {
      firstLine(chalk.red(CROSS_MARK), WS, chalk.gray(message), NEW_LINE);
      return status.error(ex);
    },
  };
}

async function doReport(message: string): Promise<StatusReport> {
  const firstLine = await createLine();
  const status = await catchReport();
  let pMessage = message;

  return {
    ...status,
    async pass(): Promise<void> {
      firstLine(chalk.green(CHECK_MARK), WS, chalk.grey(pMessage), NEW_LINE);
    },

    async fail(reason: TestFail): Promise<void> {
      firstLine(chalk.red(CROSS_MARK), WS, chalk.gray(pMessage), NEW_LINE);
      return status.fail(reason);
    },

    async error(ex: Error): Promise<void> {
      firstLine(chalk.red(CROSS_MARK), WS, chalk.gray(pMessage), NEW_LINE);
      return status.error(ex);
    },

    async progress(message: string): Promise<void> {
      pMessage = message;
      firstLine(chalk.grey(CHECK_MARK), WS, chalk.grey(pMessage));
    },
  };
}

function beforeScenarioReport(feature: string, scenario: string): Promise<StatusReport> {
  stdout.write(chalk.whiteBright.bold(feature) + '\\' + chalk.whiteBright(scenario));
  stdout.write(NEW_LINE);
  return catchReport();
}

async function emptyReport(): Promise<StatusReport> {
  return {
    async pass(): Promise<void> {

    },

    async fail(reason: TestFail): Promise<void> {
    },

    async error(ex: Error): Promise<void> {
    },

    async progress(message: string): Promise<void> {
    },

    async inspect(info: InspectInfo): Promise<void> {
    },
  };

}
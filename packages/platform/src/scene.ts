import { Data, errors, Guard, isObject, reinterpret } from '@skintest/common';
import { Browser, pass, RepeatEntry, Scenario, Script, StepExecutionResult, Steps, Suite, TestResult, Value, VALUE_REF } from '@skintest/sdk';
import { Attempt } from './attempt';
import { Feedback, FeedbackList, FeedbackResult } from './feedback';
import { CommandScope, Datum, Staging } from './stage';

function noScenario(): Scenario {
  return {
    name: '',
    steps: [],
    attributes: {}
  };
}

export class Scene {
  constructor(
    private suite: Suite,
    private effect: Staging,
    private browser: Browser,
    private attempt: Attempt,
  ) {
  }

  play(script: Script): Promise<void> {
    return this.feature(script);
  }

  private async feature(script: Script): Promise<void> {
    const beforeFeatureEffect = this.effect('feature:before');
    const afterFeatureEffect = this.effect('feature:after');

    const scope = {
      suite: this.suite,
      browser: this.browser,
      script,
    };

    await beforeFeatureEffect(scope);

    const feedback = await this.plan(
      'feature:before',
      script,
      noScenario(),
      script.beforeFeature
    );

    if (feedback.signal === 'continue') {
      for (const scenario of script.scenarios) {
        await this.scenario(script, scenario);
      }
    }

    await afterFeatureEffect(scope);

    await this.plan(
      'feature:after',
      script,
      noScenario(),
      script.afterFeature
    );
  }

  private async scenario(
    script: Script,
    scenario: Scenario
  ): Promise<void> {

    const beforeScenarioEffect = this.effect('scenario:before');
    const afterScenarioEffect = this.effect('scenario:after');
    const scope = {
      suite: this.suite,
      browser: this.browser,
      script,
      scenario,
    };

    await beforeScenarioEffect(scope);

    const feedback = await this.plan(
      'scenario:before',
      script,
      scenario,
      script.beforeScenario
    );

    if (feedback.signal === 'continue') {
      const { attributes } = scenario;
      const data = attributes.data ?? [undefined];
      for (let i = 0; i < data.length; i++) {
        const datum: Datum = [i, data[i]];
        await this.steps(script, scenario, datum);
      }
    }

    await afterScenarioEffect(scope);

    await this.plan(
      'scenario:after',
      script,
      scenario,
      script.afterScenario
    );

    await this.browser.clear();
  }

  private async steps(
    script: Script,
    scenario: Scenario,
    datum: Datum,
  ): Promise<FeedbackResult> {
    const beforeStepEffect = this.effect('step:before');
    const afterStepEffect = this.effect('step:after');
    const { steps } = scenario;
    const feedback = new FeedbackList();

    for (const step of steps) {
      const scope = {
        suite: this.suite,
        browser: this.browser,
        script,
        scenario,
        step,
        datum
      };

      await beforeStepEffect(scope);

      feedback.add(
        await this.plan(
          'step:before',
          script,
          scenario,
          script.beforeStep
        )
      );

      if (feedback.ok()) {
        feedback.add(
          await this.plan(
            'step',
            script,
            scenario,
            [step],
            [],
            datum
          )
        );
      }

      await afterStepEffect(scope);

      feedback.add(
        await this.plan(
          'step:after',
          script,
          scenario,
          script.afterStep
        )
      );

      const loop = feedback.reduce();
      if (loop.signal === 'exit') {
        // only returns on `exit` signal,
        // `break` signal is for the plan loop
        return loop;
      }
    }

    return feedback.reduce();
  }

  private async plan(
    site: CommandScope['site'],
    script: Script,
    scenario: Scenario,
    steps: Steps,
    path: Array<StepExecutionResult['type']> = [],
    datum: Datum = [0, undefined],
  ): Promise<FeedbackResult> {

    const { browser, attempt } = this;

    const stepEffect = this.effect('step');

    const scope = {
      suite: this.suite,
      browser,
      site,
      script,
      scenario,
      datum
    };

    const loop = new FeedbackList();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const materialize = (value: Value<any, Data>): any => {
      if (isObject(value) && VALUE_REF in value) {
        const [, data] = datum;
        Guard.notNull(data, 'data');

        const key = value[VALUE_REF];
        return data?.[key];
      }

      return value;
    };

    const getFeedback = () => loop.reduce();

    for (const step of steps) {
      const addFeedback = async (reason: TestResult | Error | FeedbackResult): Promise<void> => {
        const feed = { ...scope, step, path };
        const feedback = new Feedback(feed, reason);
        await stepEffect({ ...feed, feedback });
        loop.add(await feedback.get());
      };

      try {
        const run = await attempt.step(() => {
          const [, command] = step;
          return command.execute({ browser, materialize });
        });

        const runPlan =
          (planSteps: Steps) =>
            this.plan(
              site,
              script,
              scenario,
              planSteps,
              path.concat(run.type),
              datum
            );

        switch (run.type) {
          case 'method': {
            await addFeedback(pass());
            break;
          }
          case 'assert': {
            const { result } = run;
            await addFeedback(result);
            break;
          }
          case 'task':
          case 'perform': {
            const plan = await runPlan(run.body);
            await addFeedback(plan);
            break;
          }
          case 'condition': {
            const condition = await runPlan(run.cause);
            if (condition.signal === 'break') {
              // override `break` to `continue` to not stop the loop
              // override fail tests to pass
              await addFeedback({
                signal: 'continue',
                issuer: overrideFails(condition.issuer)
              });
              break;
            }

            if (condition.signal === 'exit') {
              await addFeedback(condition);
              break;
            }

            const body = await runPlan(run.body);
            await addFeedback(body);
            break;
          }
          case 'repeat': {
            // todo: add timeout exception or warning if loop runs too long
            let index = 0;
            let odd = false;
            let even = true;
            let first = true;

            const repeat = new FeedbackList();

            do {
              const entry: RepeatEntry = { first, index, odd, even, };

              first = false;
              index++;
              odd = !odd;
              even = !even;

              run.writes.forEach(x => x.next(entry));

              const condition = await runPlan(run.till);
              if (condition.signal === 'break') {
                // override `break` to `continue` to not stop the loop
                // override fail tests to pass
                repeat.add({
                  signal: 'continue',
                  issuer: overrideFails(condition.issuer)
                });
                break;
              }

              if (condition.signal === 'exit') {
                repeat.add(condition);
                break;
              }

              repeat.add(await runPlan(run.body));
              if (!repeat.ok()) {
                break;
              }

              // eslint-disable-next-line no-constant-condition
            } while (true);

            await addFeedback(repeat.reduce());
            break;
          }
          case 'event': {
            const [handler, trigger] = await Promise.all([
              runPlan(run.handler),
              runPlan(run.trigger),
            ]);

            const event = new FeedbackList();
            event.add(handler);
            event.add(trigger);

            await addFeedback(event.reduce());
            break;
          }
          default: {
            throw errors.invalidArgument('type', reinterpret<StepExecutionResult>(run).type);
          }
        }
      } catch (ex) {
        await addFeedback(ex);
      }

      const feedback = getFeedback();
      if (feedback.signal !== 'continue') {
        return feedback;
      }
    }

    return getFeedback();
  }
}

function overrideFails(issuer: FeedbackResult['issuer']): FeedbackResult['issuer'] {
  return issuer.map(x => {
    if (x instanceof Error) {
      return x;
    }

    if (x.status === 'pass') {
      return x;
    }

    return pass(x.description);
  });
}
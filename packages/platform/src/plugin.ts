import { OnStage, Stages, Staging } from './stage';
import { Zone } from './zone';

export type Plugin = (stage: OnStage) => Promise<void>;

export function orchestrate(plugins: Plugin[]): Staging {
  return <Z extends Zone>(zone: Z) =>
    async (...scope: Parameters<Stages[Z]>): Promise<void> => {

      const onStage: OnStage = async stages => {
        for (const key in stages) {
          if (zone === key) {
            const run = stages[zone];
            if (run) {
              // todo: get rid of any
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const arg = scope[0] as any;
              await run(arg);
            }
          }
        }
      };

      for (const plugin of plugins) {
        await plugin(onStage);
      }
    };
}
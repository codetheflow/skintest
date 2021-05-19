import { OnStage, Stages, Staging } from './stage';
import { Zone } from './zone';

export type Plugin = (stage: OnStage) => Promise<void>;

export function orchestrate(plugins: Plugin[]): Staging {
  return <Z extends Zone>(zone: Z) =>
    async (...scope: Parameters<Stages[Z]>): Promise<void> => {

      const onStage: OnStage = async stages => {
        for (let key in stages) {
          if (zone === key) {
            const run = stages[zone];
            if (run) {
              // todo: get rid of any
              // todo: better return result
              await run(scope[0] as any);
            }
          }
        }
      };

      for (let plugin of plugins) {
        await plugin(onStage);
      }

    };
}

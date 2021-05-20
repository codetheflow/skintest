import { OnStage, Plugin } from '@skintest/platform';
import * as chalk from 'chalk';

const { stdout, stderr, stdin } = process;

const ART = String.raw`
__   .__        __                   __   
_____|  | _|__| _____/  |_  ____   _______/  |_ 
/  ___/  |/ /  |/    \   __\/ __ \ /  ___/\   __\
\___ \|    <|  |   |  \  | \  ___/ \___ \  |  |  
/____  >__|_ \__|___|  /__|  \___  >____  > |__|  
   \/     \/       \/          \/     \/        
`;

const logo = chalk.grey;

export function ttyLogo(): Plugin {
  stdout.write(logo(ART));

  return async (stage: OnStage) => stage({});
}
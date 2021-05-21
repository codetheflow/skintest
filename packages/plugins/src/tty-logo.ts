import { OnStage, Plugin } from '@skintest/platform';
import * as chalk from 'chalk';

const { stdout } = process;

// todo: add stripIndent function
const ART = String.raw`
__   .__        __                   __   
_____|  | _|__| _____/  |_  ____   _______/  |_ 
/  ___/  |/ /  |/    \   __\/ __ \ /  ___/\   __\
\___ \|    <|  |   |  \  | \  ___/ \___ \  |  |  
/____  >__|_ \__|___|  /__|  \___  >____  > |__|  
   \/     \/       \/          \/     \/        
`.trim();

const NEW_LINE = '\n';
const logo = chalk.grey;

export function ttyLogo(): Plugin {
  stdout.write(logo(ART));
  stdout.write(NEW_LINE);

  return async (stage: OnStage) => stage({});
}
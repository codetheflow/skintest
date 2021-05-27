import { OnStage, Plugin } from '@skintest/platform';
import { tty } from './tty';

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

export function ttyLogo(): Plugin {
  tty.newLine(stdout, tty.logo(ART));

  return async (stage: OnStage) => stage({});
}
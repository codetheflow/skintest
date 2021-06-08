import { Command } from './command';

export type RecipeOperator = () => Promise<Recipe>;
export interface Recipe {
  plan: Command[];
}

export async function recipe(...operators: RecipeOperator[]): Promise<Recipe> {
  const commands = [];
  for (const op of operators) {
    const { plan } = await op();
    commands.push(...plan);
  }

  return {
    plan: commands,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RecipeFunction = (...args: any[]) => Promise<Recipe>;
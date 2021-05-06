export type Zone =
  'init'
  | 'destroy'
  | 'before.feature'
  | 'after.feature'
  | 'before.scenario'
  | 'after.scenario'
  | 'before.step'
  | 'after.step'
  | 'step';
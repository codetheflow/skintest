export type PlatformZone =
  'platform:mount'
  | 'platform:unmount';

export type ProjectZone =
  | 'project:mount'
  | 'project:unmount'
  | 'project:init'
  | 'project:error';

export type ScriptZone =
  'feature:before'
  | 'feature:after'
  | 'scenario:before'
  | 'scenario:after'
  | 'step:before'
  | 'step:after'
  | 'step'
  | 'step:pass'
  | 'step:fail'
  | 'step:inspect';

export type Zone =
  PlatformZone
  | ProjectZone
  | ScriptZone;
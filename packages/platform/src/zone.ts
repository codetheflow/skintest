export type PlatformZone =
  'platform:mount'
  | 'platform:unmount'
  | 'platform:ready'
  | 'platform:error';

export type ProjectZone =
  | 'project:mount'
  | 'project:unmount'
  | 'project:ready'
  | 'project:error';

export type ScriptZone =
  'feature:before'
  | 'feature:after'
  | 'scenario:before'
  | 'scenario:after'
  | 'step:before'
  | 'step:after'
  | 'step';

export type Zone =
  PlatformZone
  | ProjectZone
  | ScriptZone;

export interface Project<S> {
  run(settings: S): Promise<void>;
}
export interface Project {
  addFeaturesFrom(path: string): Promise<void>;
  run(): Promise<void>;
}

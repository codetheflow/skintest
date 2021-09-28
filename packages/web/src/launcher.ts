export interface Launcher<T> {
  getAgents(): Promise<string[]>;

  getCurrentDevice(): T;
  openDevice(agent: string): Promise<void>;
  closeDevice(device: T): Promise<void>;
}
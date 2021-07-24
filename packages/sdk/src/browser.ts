import { Page } from './page';

export interface Browser {
  readonly timeout: number;

  openTab(id: string): Promise<void>;
  openWindow(id: string): Promise<void>;
  getCurrentPage(): Page;
  close(): Promise<void>;
}
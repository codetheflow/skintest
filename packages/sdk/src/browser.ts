import { Page } from './page';

export interface Browser {
  readonly timeout: number;

  openPage(id: string): Promise<void>;
  closePage(id: string): Promise<void>;
  getCurrentPage(): Page;

  clear(): Promise<void>;
  close(): Promise<void>;
}
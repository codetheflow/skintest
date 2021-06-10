import { Page } from './page';

export interface Browser {
  readonly timeout: number;

  openPage(id: string): Promise<void>;
  getCurrentPage(): Page;
  close(): Promise<void>;
}
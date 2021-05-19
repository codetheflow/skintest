import { Browser } from '@skintest/sdk';

export type BrowserFactory = () => Promise<Browser>
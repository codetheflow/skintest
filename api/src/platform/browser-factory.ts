import { Browser } from '../sdk/browser';

export type BrowserFactory = () => Promise<Browser>
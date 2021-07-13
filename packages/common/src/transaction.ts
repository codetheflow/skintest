export interface Transaction {
  begin(): Promise<void>;
  commit(): Promise<void>;
}


export class TransactionSink implements Transaction {
  constructor(private items: Transaction[]) {}

  async begin(): Promise<void> {
    for (const item of this.items) {
      await item.begin();
    }
  }

  async commit(): Promise<void> {
    for (const item of this.items) {
      await item.commit();
    }
  }
}
export interface Transaction {
  begin(): Promise<void>;
  commit(): Promise<void>;
}


export class TransactionSink implements Transaction {
  constructor(private items: Transaction[]) {}

  async begin(): Promise<void> {
    for await (const item of this.items) {
      item.begin();
    }
  }

  async commit(): Promise<void> {
    for await (const item of this.items) {
      item.commit();
    }
  }
}
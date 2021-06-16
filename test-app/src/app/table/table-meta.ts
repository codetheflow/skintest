import { AppError } from '../common/error';

// exercise comment:
// another way is to have instead of String, an Object type for the column definition
// with properties like `isVisible`, but we are experimenting here with a simple API
// which is extendable by column meta concept, let's see how it works
export type Column = string;
export type Row = any;

export type ColumnCategory = 'data' | 'control';

// exercise comment:
// we introduce meta concept to filter out row-actions column
// in the column-chooser component
export interface ColumnMeta {
  category: 'data' | 'control';
}

export class TableMeta {
  private readonly store = new Map<string, ColumnMeta>();

  setColumn(key: string, meta: ColumnMeta): void {
    this.store.set(key, meta);
  }

  getColumn(key: string): ColumnMeta {
    const meta = this.findColumn(key);
    if (!meta) {
      throw new AppError(`meta for column "${key}" is not found`);
    }

    return meta;
  }

  findColumn(key: string): ColumnMeta | null {
    const meta = this.store.get(key);
    return meta;
  }

  deleteColumn(key: string): boolean {
    return this.store.delete(key);
  }
}
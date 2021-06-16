import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Column, Row, TableMeta } from './table-meta';
import { TableState } from './table-state';

@Injectable()
export class TableService {
  private rows: Row[] = [];
  private columns: Column[] = [];
  private readonly updateStateRequest$ = new BehaviorSubject<TableState>('empty');

  readonly updateState$ = this.updateStateRequest$.pipe(distinctUntilChanged());
  readonly meta = new TableMeta();

  /**
   * Rows should be changed only from the table.component
   * @param rows table rows
   */
  setRows(rows: Row[]): void {
    // exercise comment:
    // if we build a shared library component we could protect
    // rows and columns by using not exported Symbol check
    this.rows = rows || [];
    this.checkState();
  }

  /**
   * Columns should be changed only from the table.component
   * @param columns table columns
   */
  setColumns(columns: Column[]): void {
    this.columns = columns || [];
  }

  getColumns(): ReadonlyArray<Column> {
    return this.columns;
  }

  getRows(): ReadonlyArray<Row> {
    return this.rows;
  }

  checkState() {
    const state = this.getRows().length ? 'has-rows' : 'empty';
    this.updateStateRequest$.next(state);
  }
}

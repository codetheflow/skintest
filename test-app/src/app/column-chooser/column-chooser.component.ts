import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Command } from '../command/command';
import { Checked, convert, convertBack } from '../common/checked';
import { Column } from '../table/table-meta';
import { TableService } from '../table/table.service';

type CheckedColumn = Checked<Column>;

@Component({
  selector: 'st-column-chooser',
  templateUrl: './column-chooser.component.html',
  styleUrls: ['./column-chooser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnChooserComponent implements OnChanges {
  checkedColumns: CheckedColumn[] = [];

  @Input() columns: Column[] = [];
  @Output() readonly selectionChange = new EventEmitter<Column[]>();

  readonly toggle = new Command<CheckedColumn>({
    canExecute: column => {
      const columns = this.checkedColumns;
      const checked = columns.filter(x => x.state);
      return !column.state || checked.length > 1;
    },
    execute: column => {
      column.state = !column.state;

      const { meta } = this.table;
      const controlColumns = (this.columns || [])
        .filter(key => meta.findColumn(key)?.category === 'control');

      const columns = this.checkedColumns;

      this.selectionChange.emit([
        ...convertBack(columns),
        ...controlColumns
      ]);
    }
  });

  constructor(private readonly table: TableService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.columns) {
      const { meta } = this.table;
      const nonControlColumns = (this.columns || [])
        .filter(key => meta.findColumn(key)?.category !== 'control');

      this.checkedColumns =
        convert(nonControlColumns, this.table.getColumns());

    }
  }
}

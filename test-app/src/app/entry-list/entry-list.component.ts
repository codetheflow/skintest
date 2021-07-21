import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Command } from '../command/command';
import { EntryRow } from '../entry-data/entry-row';

type ColumnList = Array<keyof EntryRow | 'row-actions'>;

@Component({
  selector: 'st-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryListComponent {
  readonly supportUrl = 'https://skintest.io';

  readonly columns: ColumnList = [
    'date',
    'name',
    'folder',
    'user',
    'status',
    'row-actions'
  ];

  readonly visibleColumns$ = new BehaviorSubject(this.columns);

  // todo: describe why I choose this strategy
  @Input() items: EntryRow[] = [];
  @Output() readonly addItems = new EventEmitter<void>();

  readonly updateColumnsVisibility = new Command<ColumnList>({
    execute: (columns) => this.visibleColumns$.next(columns)
  });

  readonly addData = new Command({
    execute: () => this.addItems.emit()
  });

  readonly toggleStatus = new Command<EntryRow>({
    execute: (row) => row.status = row.status === 'completed' ? 'pending' : 'completed',
  });

  readonly deleteRow = new Command<EntryRow>({
    execute: (row) => this.items = this.items.filter(item => item !== row),
  });

  readonly support = new Command({
    // todo: inject window
    execute: () => window.open(this.supportUrl, '__blank')
  });
}
import { Directive, Input, OnInit } from '@angular/core';
import { AppError } from '../common/error';
import { Tidy } from '../common/tidy';
import { ColumnCategory } from './table-meta';
import { TableService } from './table.service';

@Directive({
  selector: '[stColumn]',
  providers: [
    Tidy
  ]
})
export class ColumnDirective implements OnInit {
  @Input('stColumn') key: string;
  @Input() category: ColumnCategory = 'data';

  constructor(private readonly table: TableService) { }

  ngOnInit(): void {
    // todo: change to ngOnChanges

    // exercise comment:
    // for simplicity we use onInit instead of ngChanges
    // and `this` as a meta info container
    if (!this.key) {
      throw new AppError('column key should be defined');
    }

    this.table.meta.setColumn(this.key, this);
  }
}

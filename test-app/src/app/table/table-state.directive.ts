import { Directive, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { TemplateCacheService } from '../template/template-cache.service';
import { TableState } from './table-state';
import { TableService } from './table.service';

@Directive({
  selector: '[stTableState]'
})
export class TableStateDirective implements OnChanges {
  @Input('stTableState') state: TableState;

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly templateCache: TemplateCacheService,
    private readonly table: TableService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.state) {
      if (changes.state.previousValue) {
        this.templateCache.delete(`state-${this.state}`);
      } else {
        this.templateCache.set(`state-${this.state}`, this.templateRef);
      }

      this.table.checkState();
    }
  }
}

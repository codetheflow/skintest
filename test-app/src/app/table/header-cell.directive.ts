import { Directive, OnInit, TemplateRef } from '@angular/core';
import { TemplateCacheService } from '../template/template-cache.service';
import { ColumnDirective } from './column.directive';
import { HEADER_CELL_TEMPLATE_PREFIX } from './table.component';

@Directive({
  selector: '[stHeaderCell]'
})
export class HeaderCellDirective implements OnInit {
  constructor(
    private readonly column: ColumnDirective,
    private readonly templateRef: TemplateRef<any>,
    private readonly templateCache: TemplateCacheService,
  ) { }

  ngOnInit(): void {
    this.templateCache.set(`${HEADER_CELL_TEMPLATE_PREFIX}-${this.column.key}`, this.templateRef);
  }
}
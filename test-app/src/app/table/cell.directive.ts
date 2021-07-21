import { Directive, OnInit, TemplateRef } from '@angular/core';
import { TemplateCacheService } from '../template/template-cache.service';
import { ColumnDirective } from './column.directive';
import { CELL_TEMPLATE_PREFIX } from './table.component';

@Directive({
  selector: '[stCell]'
})
export class CellDirective implements OnInit {
  constructor(
    private readonly column: ColumnDirective,
    private readonly templateRef: TemplateRef<unknown>,
    private readonly templateCache: TemplateCacheService,
  ) { }

  ngOnInit(): void {
    this.templateCache.set(`${CELL_TEMPLATE_PREFIX}-${this.column.key}`, this.templateRef);
  }
}
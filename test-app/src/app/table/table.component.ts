import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Inject, InjectionToken, Input, Renderer2, TemplateRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Command } from '../command/command';
import { eventPath } from '../common/dom';
import { Tidy } from '../common/tidy';
import { TemplateCacheService } from '../template/template-cache.service';
import { Column, Row } from './table-meta';
import { TableService } from './table.service';

// the basic idea of st-table API is taken from the angular material
// but with some reasonable simplifications, like default header cell and
// cell templates, redundant row directive and cell components

const TIDY_ROW_HOVER = new InjectionToken<Tidy>('tidy.row-hover');

const TABLE_CLASS = 'table';
const ROW_HOVER_CLASS = `${TABLE_CLASS}__row--hover`;
export const CELL_TEMPLATE_PREFIX = 'cell-the';
export const HEADER_CELL_TEMPLATE_PREFIX = 'header-cell-the';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'table[st-table]',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TemplateCacheService,
    TableService,
    { provide: TIDY_ROW_HOVER, useClass: Tidy }
  ]
})
export class TableComponent {
  private readonly rowHover = new Command<HTMLTableRowElement>({
    execute: row => {
      this.tidyRowHover.run();
      this.renderer.addClass(row, ROW_HOVER_CLASS);
      this.tidyRowHover.add(() => this.renderer.removeClass(row, ROW_HOVER_CLASS));
    }
  });

  private readonly mouseLeave = new Command({
    execute: () => this.tidyRowHover.run()
  });

  readonly state$ = this
    .table
    .updateState$
    .pipe(
      map(state => [state, this.templateCache.get(`state-${state}`)])
    );

  @HostBinding(`class.${TABLE_CLASS}`) readonly hostClass = true;
  @HostBinding('class') stateClass = 'empty';

  @Input()
  get rows(): Row[] { return this.table.getRows() as Row[]; }
  set rows(value: Row[]) {
    this.table.setRows(value);
  }

  @Input()
  get columns(): Column[] { return this.table.getColumns() as Column[]; }
  set columns(value: Column[]) {
    this.table.setColumns(value);
  }

  constructor(
    @Inject(TIDY_ROW_HOVER) private readonly tidyRowHover: Tidy,
    private readonly templateCache: TemplateCacheService,
    private readonly table: TableService,
    private readonly renderer: Renderer2,
    readonly elementRef: ElementRef,
  ) {
    // we don't need to unsubscribe here, because service and
    // component have the same lifetime cycle
    this.state$.subscribe(([state]) => this.stateClass = `${TABLE_CLASS}--${state}`);

    // as we're using onPush and not @HostListener we
    // don't need to invoke below out of NgZone
    fromEvent(this.elementRef.nativeElement, 'mouseleave')
      .subscribe(() => this.mouseLeave.prob());

    // do not trigger rowHover if mousemove target was not changed
    fromEvent(this.elementRef.nativeElement, 'mousemove')
      .pipe(
        map(eventPath),
        map(path => path.find(x => (x as HTMLElement).tagName === 'TR')),
        distinctUntilChanged((a, b) => !this.tidyRowHover.isEmpty() && a === b),
        filter(x => !!x)
      )
      .subscribe(x => this.rowHover.prob(x as HTMLTableRowElement));
  }

  rowId(index: number, row: Row): unknown {
    // as a future enhancement
    // we can pass id configuration to better utilize *ngFor
    return row;
  }

  columnId(index: number, column: Column): unknown {
    return column;
  }

  getHeaderCellTemplate(column: Column): TemplateRef<unknown> {
    return this.templateCache.get(`${HEADER_CELL_TEMPLATE_PREFIX}-${column}`)
      || this.templateCache.get(`${HEADER_CELL_TEMPLATE_PREFIX}-$default`);
  }

  getCellTemplate(column: Column): TemplateRef<unknown> {
    return this.templateCache.get(`${CELL_TEMPLATE_PREFIX}-${column}`)
      || this.templateCache.get(`${CELL_TEMPLATE_PREFIX}-$default`);
  }
}
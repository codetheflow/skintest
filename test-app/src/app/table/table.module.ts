import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CellDirective } from './cell.directive';
import { ColumnDirective } from './column.directive';
import { HeaderCellDirective } from './header-cell.directive';
import { TableStateDirective } from './table-state.directive';
import { TableComponent } from './table.component';

@NgModule({
  declarations: [
    CellDirective,
    ColumnDirective,
    HeaderCellDirective,
    TableComponent,
    TableStateDirective,
  ],
  exports: [
    CellDirective,
    ColumnDirective,
    HeaderCellDirective,
    TableComponent,
    TableStateDirective,
  ],
  imports: [
    CommonModule,
  ]
})
export class TableModule { }
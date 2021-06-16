import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommandModule } from '../command/command.module';
import { IconModule } from '../icon/icon.module';
import { ColumnChooserComponent } from './column-chooser.component';

@NgModule({
  declarations: [
    ColumnChooserComponent,
  ],
  exports: [
    ColumnChooserComponent,
  ],
  imports: [
    CommonModule,
    CommandModule,
    IconModule,
  ],
})
export class ColumnChooserModule { }

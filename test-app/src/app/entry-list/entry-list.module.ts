import { NgModule } from '@angular/core';
import { ColumnChooserModule } from '../column-chooser/column-chooser.module';
import { CommandModule } from '../command/command.module';
import { CommonModule } from '@angular/common';
import { EntryListComponent } from './entry-list.component';
import { IconModule } from '../icon/icon.module';
import { PopupModule } from '../popup/popup.module';
import { StepsModule } from '../steps/steps.module';
import { TableModule } from '../table/table.module';
import { UpsellModule } from '../upsell/upsell.module';

@NgModule({
  declarations: [
    EntryListComponent
  ],
  exports: [
    EntryListComponent
  ],
  imports: [
    ColumnChooserModule,
    CommandModule,
    CommonModule,
    IconModule,
    PopupModule,
    StepsModule,
    TableModule,
    UpsellModule,
  ]
})
export class EntryListModule { }

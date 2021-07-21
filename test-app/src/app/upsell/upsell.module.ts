import { NgModule } from '@angular/core';
import { CommandModule } from '../command/command.module';
import { CommonModule } from '@angular/common';
import { IconModule } from '../icon/icon.module';
import { UpsellComponent } from './upsell.component';

@NgModule({
  declarations: [
    UpsellComponent
  ],
  exports: [
    UpsellComponent
  ],
  imports: [
    CommandModule,
    CommonModule,
    IconModule,
  ]
})
export class UpsellModule { }
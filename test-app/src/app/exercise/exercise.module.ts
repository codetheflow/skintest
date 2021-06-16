import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommandModule } from '../command/command.module';
import { EntryDataModule } from '../entry-data/entry-data.module';
import { EntryListModule } from '../entry-list/entry-list.module';
import { ExerciseComponent } from './exercise.component';

@NgModule({
  declarations: [
    ExerciseComponent
  ],
  imports: [
    CommonModule,
    CommandModule,
    EntryDataModule,
    EntryListModule,
  ],
  exports: [
    ExerciseComponent
  ]
})
export class ExerciseModule { }

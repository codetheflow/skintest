import { NgModule } from '@angular/core';
import { StepsDirective } from './steps.directive';

@NgModule({
  declarations: [
    StepsDirective
  ],
  exports: [
    StepsDirective
  ]
})
export class StepsModule { }
import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { PopupTriggerDirective } from './popup-trigger.directive';

@NgModule({
  declarations: [
    PopupTriggerDirective
  ],
  imports: [
    OverlayModule
  ],
  exports: [
    PopupTriggerDirective
  ]
})
export class PopupModule { }
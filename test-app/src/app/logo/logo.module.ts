import { NgModule } from '@angular/core';
import { IconModule } from '../icon/icon.module';
import { LogoComponent } from './logo.component';

@NgModule({
  declarations: [
    LogoComponent
  ],
  exports: [
    LogoComponent
  ],
  imports: [
    IconModule
  ]
})
export class LogoModule { }
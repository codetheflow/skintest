import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExerciseModule } from './exercise/exercise.module';
import { LogoModule } from './logo/logo.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ExerciseModule,
    LogoModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

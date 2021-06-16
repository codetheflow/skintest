import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExerciseComponent } from './exercise/exercise.component';

const routes: Routes = [
  {
    path: '',
    component: ExerciseComponent,
    data: {
      title: 'test-app',
      description: 'May 2021'
    },
    children: [
      {
        path: 'child',
        component: ExerciseComponent,
        data: {
          title: 'test-app',
          description: 'June 2021'
        },
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
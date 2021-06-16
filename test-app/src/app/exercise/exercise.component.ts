import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Command } from '../command/command';
import { EntryDataService } from '../entry-data/entry-data.service';
import { EntryRow } from '../entry-data/entry-row';

@Component({
  selector: 'st-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseComponent {
  entries$: Observable<EntryRow[]>;

  readonly populateData = new Command({
    execute: () => this.entries$ = this.dataService.getEntriesView()
  });

  constructor(private dataService: EntryDataService) {
    this.populateData.prob();
  }
}

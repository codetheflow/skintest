import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Command } from '../command/command';

@Component({
  selector: 'st-upsell',
  templateUrl: './upsell.component.html',
  styleUrls: ['./upsell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpsellComponent {
  @Output() readonly requestAddData = new EventEmitter();

  readonly addData = new Command({
    execute: () => this.requestAddData.emit()
  });
}
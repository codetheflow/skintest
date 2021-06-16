import { Directive, DoCheck, ElementRef, Inject, InjectionToken, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { Tidy } from '../common/tidy';
import { Command } from './command';

const TIDY_COMMAND = new InjectionToken<Tidy>('tidy.command');
const TIDY_EVENT = new InjectionToken<Tidy>('tidy.event');

@Directive({
  selector: '[stCommand]',
  providers: [
    { provide: TIDY_COMMAND, useClass: Tidy },
    { provide: TIDY_EVENT, useClass: Tidy }
  ]
})
// tslint:disable-next-line:no-conflicting-lifecycle
export class CommandDirective implements DoCheck, OnChanges {
  @Input('stCommand') command: Command<any>;
  @Input() arg: any;
  @Input() trigger = 'click';

  constructor(
    @Inject(TIDY_COMMAND) private readonly tidyCommand: Tidy,
    @Inject(TIDY_EVENT) private readonly tidyEvent: Tidy,
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2
  ) {
    this.registerEvent();
  }

  ngDoCheck() {
    if (this.command) {
      this.updateState();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.command) {
      this.unregisterCommand();

      if (this.command) {
        this.registerCommand();
      }
    }

    if (changes.trigger) {
      this.unregisterEvent();

      if (this.trigger) {
        this.registerEvent();
      }
    }
  }

  private registerEvent() {
    this.tidyEvent.add(
      this.renderer.listen(
        this.elementRef.nativeElement,
        this.trigger,
        e => this.prob(e)
      )
    );
  }

  private unregisterEvent() {
    this.tidyEvent.run();
  }

  private registerCommand() {
    this.tidyCommand.add(
      this.command
        .canExecuteCheck
        .subscribe(() => this.updateState())
    );
  }

  private unregisterCommand() {
    this.tidyCommand.run();
  }

  private prob(e: Event) {
    const { command, arg: commandArg } = this;
    if (command && command.prob(commandArg)) {
      if (command.stopPropagate) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  private updateState() {
    const canExecute = this.command.canExecute(this.arg) === true;

    if (canExecute) {
      this.renderer.removeAttribute(
        this.elementRef.nativeElement,
        'disabled'
      );
    } else {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'disabled',
        'true'
      );
    }
  }
}

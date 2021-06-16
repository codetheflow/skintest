import { Directive, Inject, InjectionToken, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { Tidy } from '../common/tidy';

const TIDY_PREVIOUS_STEP = new InjectionToken<Tidy>('tidy.previous-step');

@Directive({
  selector: '[stSteps]',
  providers: [
    { provide: TIDY_PREVIOUS_STEP, useClass: Tidy }
  ]
})
export class StepsDirective implements OnChanges {
  @Input('stSteps') firstStep: TemplateRef<any>;

  constructor(
    @Inject(TIDY_PREVIOUS_STEP) private readonly tidyPreviousStep: Tidy,
    private readonly viewContainerRef: ViewContainerRef,
    readonly templateRef: TemplateRef<any>,
  ) {
    viewContainerRef.createEmbeddedView(templateRef, this.createContext());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.firstStep) {
      if (this.firstStep) {
        this.next(this.firstStep);
      }
    }
  }

  next(template: TemplateRef<any>) {
    this.tidyPreviousStep.run();

    let view = this.viewContainerRef.createEmbeddedView(template, this.createContext());
    this.tidyPreviousStep
      .add(() => {
        if (view) {
          const index = this.viewContainerRef.indexOf(view);
          this.viewContainerRef.remove(index);
          view = null;
        }
      });
  }

  private createContext() {
    return { $implicit: this };
  }
}

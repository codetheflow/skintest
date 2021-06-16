import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Directive, ElementRef, HostListener, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AppError } from '../common/error';
import { Tidy } from '../common/tidy';

@Directive({
  selector: '[stPopupTrigger]',
  providers: [
    Tidy
  ]
})
export class PopupTriggerDirective {
  private overlayRef: OverlayRef;

  @Input() data: any;
  @Input('stPopupTrigger') templateRef: TemplateRef<any>;
  @Input() panelClass = 'popup-trigger-panel';

  constructor(
    private readonly overlay: Overlay,
    private readonly elementRef: ElementRef,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly tidy: Tidy
  ) {
  }

  @HostListener('click')
  click() {
    if (!this.templateRef) {
      throw new AppError('template should be defined before popup was triggered');
    }

    // prevent to open multiple popups from the same trigger
    if (this.overlayRef) {
      return;
    }

    const overlayConfig = this.createOverlayConfig();
    this.overlayRef = this.overlay.create(overlayConfig);

    const detach = () => this.close();

    this.tidy.add(detach);
    this.tidy.add(
      this.overlayRef
        .backdropClick()
        .subscribe(detach)
    );

    this.overlayRef.attach(
      new TemplatePortal(
        this.templateRef,
        this.viewContainerRef,
        {
          $implicit: this,
          data: this.data
        }
      )
    );
  }

  close() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = null;
    }
  }

  @HostListener('document:keydown.escape')
  escape() {
    this.close();
  }

  private createOverlayConfig() {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(
        this.elementRef
      )
      // todo: make it configurable
      .withPositions([{
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
      }])
      .withPush(true);

    return new OverlayConfig({
      hasBackdrop: true,
      positionStrategy,
      panelClass: this.panelClass ? ['popup__panel', this.panelClass] : ['popup__panel'],
      backdropClass: this.panelClass ? ['popup__backdrop', `${this.panelClass}-backdrop`] : ['popup__backdrop'],
    });
  }
}

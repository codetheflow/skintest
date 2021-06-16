import { AfterContentInit, ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';

@Component({
  selector: 'st-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent implements AfterContentInit {
  path: string;

  constructor(private readonly elementRef: ElementRef) {
  }

  ngAfterContentInit(): void {
    const element: HTMLElement = this.elementRef.nativeElement;
    const icon = element.textContent.trim();
    this.path = `../assets/${icon}.svg`;
  }
}
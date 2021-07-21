import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';


@Component({
  selector: 'st-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  readonly page$ = this.router
    .events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.activatedRoute;
        while (child.firstChild) {
          child = child.firstChild;
        }

        if ('title' in child.snapshot.data) {
          return child.snapshot.data;
        }

        return {
          title: 'test-app',
          description: ''
        };
      })
    );

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
  }
}
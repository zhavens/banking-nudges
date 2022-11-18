import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';

import { User } from '@/models/user';
import { AuthenticationService } from '@app/services/auth.service';
import { LoggingService } from '@app/services/logging.service';
import { PersonalizationService } from '@app/services/personalization.service';
import { filter } from 'rxjs';

@Component({ selector: 'app', templateUrl: 'app.component.html', styleUrls: ['app.component.css'] })
export class AppComponent implements OnInit {
  currentUserObs: User = new User();

  constructor(
    private router: Router,
    private logging: LoggingService,
    public auth: AuthenticationService,
    public personalization: PersonalizationService,
  ) {
    this.auth.currentUserObs.subscribe(x => this.currentUserObs = x);
    router.events.pipe(
      filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      // if (!router.navigated) {
      //   this.logging.clearLog()
      // }
      if (e.urlAfterRedirects != e.url) {
        this.logging.info(`Redirected from ${e.url} to ${e.urlAfterRedirects}`);
      } else {
        this.logging.info(`Routed to ${e.url}`);
      }
    });
  }

  ngOnInit(): void {

  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  reset() {
    if (confirm('Are you sure you want to reset the app?')) {
      this.auth.logout();
      this.auth.reset();
      this.router.navigate(['/login']);
    }
  }
}
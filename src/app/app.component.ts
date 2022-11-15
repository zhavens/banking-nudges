import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from '@app/services';

import { filter } from 'rxjs';
import { User } from '../models/user';
import { DatabaseService } from './services/database.service';
import { LoggingService } from './services/logging.service';
import { PersonalizationService } from './services/personalization.service';

@Component({ selector: 'app', templateUrl: 'app.component.html', styleUrls: ['app.component.css'] })
export class AppComponent implements OnInit {
  currentUserTopic: User = new User();

  constructor(
    private router: Router,
    private logging: LoggingService,
    public auth: AuthenticationService,
    private db: DatabaseService,
    public personalization: PersonalizationService,
  ) {
    this.auth.currentUserTopic.subscribe(x => this.currentUserTopic = x);
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
    this.db.initialize();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  reset() {
    if (confirm('Are you sure you want to reset the app?')) {
      this.auth.logout();
      this.db.reset();
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}
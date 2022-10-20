import { AuthenticationService } from '@/services';
import { Component } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';

import { User } from '../models/user';
import { filter } from 'rxjs';
import { LoggingService } from './services/logging.service';
import { SidebarService } from './services/sidebar.service';

@Component({ selector: 'app', templateUrl: 'app.component.html', styleUrls: ['app.component.css'] })
export class AppComponent {
  currentUserTopic: User = new User();

  constructor(
    private router: Router,
    private logging: LoggingService,
    public auth: AuthenticationService,
    private sidebar: SidebarService,
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

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
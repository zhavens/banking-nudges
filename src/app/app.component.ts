import { AuthenticationService } from '@/services';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '@/models';
import { SidebarService } from './services/sidebar.service';

@Component({ selector: 'app', templateUrl: 'app.component.html', styleUrls: ['app.component.css'] })
export class AppComponent {
  currentUser: User = new User();

  constructor(
    private router: Router,
    public auth: AuthenticationService,
    private sidebar: SidebarService,
  ) {
    this.auth.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
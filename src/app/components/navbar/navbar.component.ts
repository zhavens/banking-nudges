import { AuthenticationService } from '@/services';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '@/models';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentUser: User = new User();

  constructor(
    private router: Router,
    public auth: AuthenticationService
  ) {
    this.auth.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

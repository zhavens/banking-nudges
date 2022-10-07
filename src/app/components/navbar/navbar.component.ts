import { AuthenticationService } from '@/services';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '@/models/user';
import { AdminService } from '@/services/admin.service';
import { PersonalizationService } from '@/services/personalization.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentUserTopic: User = new User();

  constructor(
    private router: Router,
    public auth: AuthenticationService,
    public admin: AdminService,
    private personalization: PersonalizationService
  ) {
    this.auth.currentUserTopic.subscribe(x => this.currentUserTopic = x);
  }

  logout() {
    this.personalization.doLogoutUpdate();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

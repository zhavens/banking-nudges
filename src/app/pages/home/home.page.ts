import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthenticationService } from '@app/services/auth.service';
import { PersonalizationService } from '@app/services/personalization.service';
import { SidebarType } from '@models/sidebar';
import { User } from '@models/user';

@Component({
  styleUrls: ['home.page.css'],
  templateUrl: 'home.page.html'
})
export class HomePage implements OnInit {
  SidebarType = SidebarType;

  user: User = new User();

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private personalization: PersonalizationService
  ) {
    this.auth.currentUserObs.subscribe((user: User) => {
      this.user = user;
    })
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() { }
}
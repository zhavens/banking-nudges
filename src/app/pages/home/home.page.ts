import { Component, OnInit } from '@angular/core';

import { User } from '@/models/user';
import { AuthenticationService, UserService } from '@/services';
import { Router } from '@angular/router';

@Component({ templateUrl: 'home.page.html' })
export class HomePage implements OnInit {
  currentUser?: User;
  users: User[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
  ) {
    this.currentUser = this.authenticationService.currentUser;
    if (!this.authenticationService.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.loadAllUsers();
  }

  private loadAllUsers() {
    this.users = this.userService.getAll();
    // this.userService.getAll()
    //   .pipe(first())
    //   .subscribe(users => this.users = users);
  }
}
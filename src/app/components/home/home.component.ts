import { Component, OnInit } from '@angular/core';

import { User } from '@/models';
import { AuthenticationService, UserService } from '@/services';
import { Router } from '@angular/router';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
  currentUser: User | null;
  users: User[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
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
import { User } from '@/models';
import { AuthenticationService, UserService } from '@/services';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: User[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadAllUsers();
  }

  deleteUser(id: number) {
    this.userService.delete(id)
    this.loadAllUsers();
    // .pipe(first())
    // .subscribe(() => this.loadAllUsers());
  }

  private loadAllUsers() {
    this.users = this.userService.getAll()
    // .pipe(first())
    // .subscribe(users => this.users = users);
  }
}

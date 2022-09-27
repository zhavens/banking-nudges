import { User } from '@/models/user';
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
    if (confirm("Are you sure you want to delete this user?")) {
      this.userService.delete(id)
      this.loadAllUsers();
    }
  }

  private loadAllUsers() {
    this.users = this.userService.getAll()
  }
}

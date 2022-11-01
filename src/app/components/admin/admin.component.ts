import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserService } from '@app/services';
import { AdminService } from '@app/services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  constructor(
    public auth: AuthenticationService,
    public admin: AdminService,
    private userService: UserService,
  ) { }

  ngOnInit() { }
}

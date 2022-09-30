import { AuthenticationService, UserService } from '@/services';
import { AdminService } from '@/services/admin.service';
import { Component, OnInit } from '@angular/core';

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

import { User } from '@/models/user';
import { AuthenticationService } from '@/services';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user?: User;

  constructor(private router: Router, private auth: AuthenticationService) { }

  ngOnInit(): void {
    if (!this.auth.currentUser) {
      this.router.navigate(['/login']);
    }
    this.user = this.auth.currentUser;
  }

}

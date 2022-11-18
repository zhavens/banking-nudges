import { AuthenticationService } from '@/app/services/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.css']
})
export class SplashPage {
  returnUrl: string = '';

  constructor(
    private router: Router,
    private auth: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.auth.isLoggedIn) {
      this.router.navigate(['/home']);
    }
  }
}

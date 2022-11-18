import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';

import { AlertService } from '@app/services/alert.service';
import { AuthenticationService } from '@app/services/auth.service';
import { User } from '@models/user';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.auth.isLoggedIn) {
      this.router.navigate(['/home']);
    }
    this.loginForm = new FormGroup([]);
    this.returnUrl = "";
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/home'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  private finalizeLogin(user: User | undefined) {
    if (user) {
      user.personalization.loginCount += 1;
      this.auth.updateUser(user);
      this.router.navigate([this.returnUrl]);
    } else {
      this.loading = false;
    }
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.auth.login(this.f['username'].value, this.f['password'].value)
      .pipe(catchError((err) => {
        console.log(err)
        this.alertService.error(typeof err === 'string' ? err : err.error)
        return of(undefined)
      }))
      .subscribe(this.finalizeLogin.bind(this));
  }
}
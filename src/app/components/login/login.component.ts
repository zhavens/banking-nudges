import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertService, AuthenticationService, UserService } from '@app/services';
import { User } from '@models/user';
import { catchError, of } from 'rxjs';

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
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.isLoggedIn) {
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
      this.userService.updateUser(user);
      this.router.navigate([this.returnUrl]);
    } else {
      // this.loginForm.reset();
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
    this.authenticationService.login(this.f['username'].value, this.f['password'].value)
      .pipe(catchError((err) => {
        console.log(err)
        this.alertService.error(err)
        return of(undefined)
      }))
      .subscribe(this.finalizeLogin.bind(this));

    // if (resp instanceof User) {
    //   resp.personalization.loginCount += 1;
    //   this.userService.updateUser(resp);
    //   this.router.navigate([this.returnUrl]);
    // } else {
    //   this.alertService.error(resp);
    //   this.loading = false;
    // }
    // this.loginForm.reset();
  }
}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '@/models';
import { AlertService, AuthenticationService, UserService } from '@/services';

@Component({
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.registerForm = new FormGroup([]);
    // redirect to home if already logged in
    // if (this.authenticationService.isLoggedIn) {
    //   this.router.navigate(['/']);
    // }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      admin: [false]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    let resp = this.userService.register(this.registerForm.value)
    if (resp instanceof User) {
      this.alertService.success('Registration successful', true);
      this.router.navigate(['/login'])
    } else {
      this.alertService.error(resp);
      this.loading = false;

    }
    // .pipe(first())
    // .subscribe(
    //   (data: any) => {
    //     this.alertService.success('Registration successful', true);
    //     this.router.navigate(['/login']);
    //   },
    //   (error: any) => {
    //     this.alertService.error(error);
    //     this.loading = false;
    //   });
  }
}
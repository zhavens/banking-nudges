import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertService, AuthenticationService, UserService } from '@app/services';
import { User } from '@models/user';
import { plainToClass } from 'class-transformer';
import { catchError, of } from 'rxjs';

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

  private finalizeRegistration(user: User | undefined) {
    if (user) {
      this.alertService.success('Registration successful', true);
      this.router.navigate(['/login'])
    }
    this.loading = false;
  }

  async onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    let user = plainToClass(User, this.registerForm.value);
    this.userService.register(user)
      .pipe(catchError((err) => {
        this.alertService.error(err.error);
        return of(undefined);
      }))
      .subscribe(this.finalizeRegistration.bind(this));
  }
}
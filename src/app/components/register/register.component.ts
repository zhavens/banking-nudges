import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertService, AuthenticationService, UserService } from '@app/services';
import { User } from '@models/user';
import { plainToClass } from 'class-transformer';

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
    let resp$ = await this.userService.register(user)
    resp$.subscribe((val) => {
      if (val instanceof Error) {
        this.alertService.error(JSON.stringify(val));
      } else if (!val) {
        this.alertService.error("Unknown error!");
      } else {
        this.alertService.success('Registration successful', true);
        this.router.navigate(['/login'])
      }
      this.loading = false;
    });
  }
}
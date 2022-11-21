import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';

import { AddCoComponent } from '@/app/components/add-co/add-co.component';
import { TasksComponent } from '@/app/components/tasks/tasks.component';
import { PersonalizationService } from '@/app/services/personalization.service';
import { isHttpError } from '@/helpers/error_typing';
import { AlertService } from '@app/services/alert.service';
import { AuthenticationService } from '@app/services/auth.service';
import { NudgeOnLogin, User } from '@models/user';

@Component({ templateUrl: 'login.page.html' })
export class LoginPage implements OnInit {
  @ViewChild(TasksComponent)
  private tasksModal!: TasksComponent;
  @ViewChild(AddCoComponent)
  private addCoModal!: AddCoComponent;

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthenticationService,
    private alertService: AlertService,
    private personalization: PersonalizationService,
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

  private finalizeLogin(user: User) {
    this.loading = false;
    this.loginForm.reset();
    this.personalization.setShownLogin();
    this.auth.updateUser(user);
    this.router.navigate([this.returnUrl]);
  }

  private handleAuth(user: User | undefined) {
    if (!user) {
      this.loading = false;
      return;
    }

    user.personalization.loginCount += 1;

    switch (user.personalization.nudgeOnLogin) {
      case NudgeOnLogin.TASKS: {
        this.tasksModal.openTasksModal(() => {
          this.finalizeLogin(user);
        })
        break;
      }
      case NudgeOnLogin.ADD_CO: {
        this.addCoModal.openAddCoModal(() => {
          this.finalizeLogin(user);
        })
        break;
      }
      default: {
        this.finalizeLogin(user);
        break;
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.auth.login(this.f['username'].value, this.f['password'].value)
      .pipe(catchError((err) => {
        const msg = err instanceof Error ? err.message : isHttpError(err) ? err.error : err;
        this.alertService.error(msg)
        return of(undefined)
      }))
      .subscribe(this.handleAuth.bind(this));
  }
}
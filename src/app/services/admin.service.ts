import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import { catchError, map, of, tap } from 'rxjs';
import { TEST_ACCOUNTS, TEST_CARDS, TEST_PAYEES, TEST_PAYMENTS, TEST_PERSONALIZATION } from '../../helpers/testdata';
import { PersonalizationConfig, User } from '../../models/user';
import { AlertService } from './alert.service';
import { AuthenticationService } from './auth.service';
import { LoggingService } from './logging.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private auth: AuthenticationService,
    private alert: AlertService,
    private logging: LoggingService,
    private users: UserService,
    private http: HttpClient,
  ) { }

  clearLogs() {
    if (confirm("Are you sure you want to clear the logs?")) {
      this.logging.clearLog();
    }
  }

  resetUser() {
    if (confirm("Are you sure you want to reset the user?")) {
      let user = this.auth.currentUser;
      if (user) {
        this.logging.warning("Resetting user via admin service.");
        user.accounts = TEST_ACCOUNTS;
        user.cards = TEST_CARDS;
        user.payees = TEST_PAYEES;
        user.payments = TEST_PAYMENTS;
        user.personalization = TEST_PERSONALIZATION;
        this.users.updateUser(user).subscribe();
      }
    }
  }

  resetAcounts() {
    if (confirm("Are you sure you want to reset the user's accounts?")) {
      let user = this.auth.currentUser;
      if (user) {
        this.logging.warning("Resetting accounts via admin service.");
        user.accounts = TEST_ACCOUNTS;
        user.cards = TEST_CARDS;
        this.users.updateUser(user).subscribe();
      }
    }
  }

  resetPayees() {
    if (confirm("Are you sure you want to reset the user's payees?")) {
      let user = this.auth.currentUser;
      if (user) {
        this.logging.warning("Resetting payees via admin service.");
        user.payees = TEST_PAYEES;
        this.users.updateUser(user).subscribe();
      }
    }
  }

  resetPayments() {
    if (confirm("Are you sure you want to reset the user's payments?")) {
      let user = this.auth.currentUser;
      if (user) {
        this.logging.warning("Resetting payments via admin service.");
        user.payments = TEST_PAYMENTS;
        this.users.updateUser(user).subscribe();
      }
    }
  }

  resetPersonalization() {
    if (confirm("Are you sure you want to reset the user's personalization?")) {
      let user = this.auth.currentUser;
      if (user) {
        this.logging.warning("Resetting personalization via admin service.");
        user.personalization = new PersonalizationConfig();
        this.users.updateUser(user).subscribe();
      }
    }
  }

  testAlertSuccess() {
    this.alert.success('Success alert.')
  }

  testAlertError() {
    this.alert.error('Error alert.')
  }

  testLoggingRequest() {
    this.logging.info('test');
  }

  testAuthRequest() {
    this.http.post('/api/auth', { username: 'test', password: 'test' }, { headers: { responseType: 'json' } })
      .pipe(
        catchError((err: any) => {
          console.log(err.error)
          return of(undefined);
        }),
        map((val) => {
          return plainToInstance(User, val)
        }),
        tap(console.log))
      .subscribe();
  }

  testLogin() {
    this.auth.login('zh', 'password')
      .pipe(
        catchError((err: any) => {
          console.log(err.error)
          return of(undefined);
        }),
        map((val) => {
          return plainToInstance(User, val)
        }),
        tap(console.log))
      .subscribe();
  }
}

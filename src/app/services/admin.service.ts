import { Injectable } from '@angular/core';
import { TEST_ACCOUNTS, TEST_CARDS, TEST_PAYEES, TEST_PAYMENTS, TEST_PERSONALIZATION } from '../../helpers/testdata';
import { PersonalizationConfig } from '../../models/user';
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
    private users: UserService
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
        user.payees = TEST_PAYEES;
        this.users.updateUser(user).subscribe();
      }
    }
  }

  resetPayments() {
    if (confirm("Are you sure you want to reset the user's payments?")) {
      let user = this.auth.currentUser;
      if (user) {
        user.payments = TEST_PAYMENTS;
        this.users.updateUser(user).subscribe();
      }
    }
  }

  resetPersonalization() {
    if (confirm("Are you sure you want to reset the user's personalization?")) {
      let user = this.auth.currentUser;
      if (user) {
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
    // this.logging.info('test').subscribe(
    //   { complete: console.log, error: console.error }
    // );
    this.logging.info('test');
  }
}

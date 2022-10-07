import { TEST_ACCOUNTS, TEST_CARDS, TEST_PAYEES, TEST_PAYMENTS } from '@/helpers/testdata';
import { PersonalizationConfig } from '@/models/user';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './auth.service';
import { LoggingService } from './logging.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private auth: AuthenticationService, private logging: LoggingService, private users: UserService
  ) { }

  clearLogs() {
    if (confirm("Are you sure you want to clear the logs?")) {
      this.logging.clearLog();
    }
  }

  resetAcounts() {
    if (confirm("Are you sure you want to reset the user's accounts?")) {
      let user = this.auth.currentUser;
      if (user) {
        user.accounts = TEST_ACCOUNTS;
        user.cards = TEST_CARDS;
        this.users.updateUser(user);
      }
    }
  }

  resetPayees() {
    if (confirm("Are you sure you want to reset the user's payees?")) {
      let user = this.auth.currentUser;
      if (user) {
        user.payees = TEST_PAYEES;
        this.users.updateUser(user);
      }
    }
  }

  resetPayments() {
    if (confirm("Are you sure you want to reset the user's payments?")) {
      let user = this.auth.currentUser;
      if (user) {
        user.payments = TEST_PAYMENTS;
        this.users.updateUser(user);
      }
    }
  }

  resetPersonalization() {
    if (confirm("Are you sure you want to reset the user's personalization?")) {
      let user = this.auth.currentUser;
      if (user) {
        user.personalization = new PersonalizationConfig();
        this.users.updateUser(user);
      }
    }
  }
}

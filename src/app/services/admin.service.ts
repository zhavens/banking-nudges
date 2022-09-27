import { TEST_ACCOUNTS } from '@/models/account';
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
        this.users.updateUser(user);
      }
    }
  }
}

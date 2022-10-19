import { PersonalizationLevel, User } from '@/models/user';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './auth.service';
import { LoggingService } from './logging.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PersonalizationService {
  user: User = new User();

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private logging: LoggingService,
  ) {
    this.authService.currentUserTopic.subscribe((user: User) => {
      this.user = user;
    })
  }

  setShownTaskModal() {
    this.logging.info(`Marking task modal as shown.`);
    this.user.personalization.showTasksModal = false;
    this.userService.updateUser(this.user);
  }

  doLogoutUpdate() {
    this.logging.info(`Updating personalization on logout.`)
    this.user.personalization.showTasksModal = true;
    this.userService.updateUser(this.user);
  }

  oaString() {
    switch (this.user.personalization.level) {
      case (PersonalizationLevel.NAME):
        return this.user.personalization.oaName;
      case (PersonalizationLevel.RELATIONSHIP):
        return `your ${this.user.personalization.oaRelation}`;
      default:
        return `the primary account holder`;
    }
  }
}

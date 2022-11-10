import { Injectable } from '@angular/core';
import Gradient from 'javascript-color-gradient';

import { PersonalizationLevel, User } from '../../models/user';
import { AuthenticationService } from './auth.service';
import { LoggingService } from './logging.service';
import { UserService } from './user.service';


// const gradient: Gradient = new Gradient().setColorGradient('#b2f2bb', '#ffd8a8');
const MIN_GRADIENT = '#ffffff';
const MAX_GRADIENT = '#ffd8a8'
const gradient: Gradient = new Gradient().setColorGradient(MIN_GRADIENT, MAX_GRADIENT);

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
    this.user.personalization.showConsequencesBanner = !this.user.personalization.showConsequencesBanner;
    this.userService.updateUser(this.user);
  }

  oaString() {
    switch (this.user.personalization.level) {
      case (PersonalizationLevel.NAME):
        return this.user.personalization.oaFirstName;
      case (PersonalizationLevel.RELATIONSHIP):
        return `your ${this.user.personalization.oaRelation}`;
      default:
        return `the primary account holder`;
    }
  }

  oaFullName() {
    return `${this.user.personalization.oaFirstName} ${this.user.personalization.oaLastName}`
  }

  getGradientColor(val: number): string {
    if (val <= 0) {
      return MIN_GRADIENT;
    } else if (val >= 1) {
      return MAX_GRADIENT;
    }
    return gradient.getColor(Math.ceil(val * gradient.getColors().length));
  }



}

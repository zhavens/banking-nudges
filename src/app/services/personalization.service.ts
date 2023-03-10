import { Injectable } from '@angular/core';
import Gradient from 'javascript-color-gradient';

import { NudgeOnLogin, PersonalizationLevel, User } from '../../models/user';
import { AuthenticationService } from './auth.service';
import { LoggingService } from './logging.service';


// const gradient: Gradient = new Gradient().setColorGradient('#b2f2bb', '#ffd8a8');
const MIN_GRADIENT = '#ffffff';
const MAX_GRADIENT = '#ffc9c9'
const gradient: Gradient = new Gradient().setColorGradient(MIN_GRADIENT, MAX_GRADIENT);

@Injectable({
  providedIn: 'root'
})
export class PersonalizationService {
  user: User = new User();

  constructor(
    private auth: AuthenticationService,
    private logging: LoggingService,
  ) {
    this.auth.currentUserObs.subscribe((user: User) => {
      this.user = user;
    })
  }

  setShownLogin() {
    // Cycle through the login options.
    if (this.user.personalization.nudgeOnLogin != NudgeOnLogin.NONE) {
      this.user.personalization.nudgeOnLogin =
        Math.max(1, (this.user.personalization.nudgeOnLogin + 1) % ((Object.keys(NudgeOnLogin).length - 1) / 2));
      this.logging.info(`Updating next loging nudge to ${NudgeOnLogin[this.user.personalization.nudgeOnLogin]}.`);
      this.auth.updateUser(this.user);
    }
  }

  doLogoutUpdate() {
    this.logging.info(`Updating personalization on logout.`)
    // this.user.personalization.showTasksModal = true;
    this.user.personalization.showConsequencesBanner = !this.user.personalization.showConsequencesBanner;
    for (let account of this.user.accounts) {
      account.showTransactions = false;
    }
    for (let card of this.user.cards) {
      card.showTransactions = false;
    }
    this.auth.updateUser(this.user);
  }

  personalString() {
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

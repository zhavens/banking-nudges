import { User } from '@/models/user';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './auth.service';
import { LoggingService } from './logging.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class NudgingService {
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
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Cookies from 'js-cookie';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';

import { User } from '../../models/user';
import { LocalCacheService } from './local_cache.service';
import { LoggingService } from './logging.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUserTopic: Observable<User>;

  constructor(
    private http: HttpClient,
    private cache: LocalCacheService,
    private logging: LoggingService) {
    this.currentUserSubject = new BehaviorSubject<User>(new User());
    this.currentUserTopic = this.currentUserSubject.asObservable();

    var loggedId = Cookies.get('currentUserId');
    if (loggedId) {
      cache.findUser(parseInt(loggedId))?.subscribe(
        (value) => {
          if (value) {
            this.currentUserSubject.next(value);
          }
        }
      );
    }
  }

  public get currentUser(): User | undefined {
    if (this.isLoggedIn) return this.currentUserSubject.value
    else return undefined;
  }

  public get isLoggedIn(): boolean {
    return this.currentUserSubject.value && this.currentUserSubject.value.username != "";
  }

  async login(username: string, password: string): Promise<User | Error> {
    const user = await firstValueFrom(this.cache.findUserByUsername(username));
    console.log(typeof user, user);
    if (!user) return Error('Username or password is incorrect.');
    else if (user.password !== password) return Error('Username or password is incorrect.');

    this.logging.info(`Logging in user ${user.username}.`)
    Cookies.set('currentUserId', JSON.stringify(user.id));
    this.currentUserSubject.next(user);
    return user;
  }

  logout() {
    this.logging.info(`Logging out user ${this.currentUserSubject.value.username}.`);
    Cookies.remove('currentUserId');
    this.currentUserSubject.next(new User());
  }

  updateUser(user: User): boolean {
    if (this.currentUser?.id != user.id) {
      return false;
    }
    this.currentUserSubject.next(user);
    return true;
  }
}
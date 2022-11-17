import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import Cookies from 'js-cookie';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

import { User } from '../../models/user';
import { DatabaseService } from './database.service';
import { LoggingService } from './logging.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUserTopic: Observable<User>;

  constructor(
    private http: HttpClient,
    private db: DatabaseService,
    private logging: LoggingService) {
    this.currentUserSubject = new BehaviorSubject<User>(new User());
    this.currentUserTopic = this.currentUserSubject.asObservable();

    var loggedUser = Cookies.get('currentUser');
    if (loggedUser) {
      this.currentUserSubject.next(plainToInstance(User, JSON.parse(loggedUser)));
      this.logging.info(`User ${this.currentUser?.username} reauthed`)
    }
  }

  public get currentUser(): User | undefined {
    if (this.isLoggedIn) return this.currentUserSubject.value
    else return undefined;
  }

  public get isLoggedIn(): boolean {
    return this.currentUserSubject.value && this.currentUserSubject.value.username != "";
  }

  private updateUserLogin(user: User) {
    this.logging.info(`Logging in user ${user.username}.`)
    Cookies.set('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  login(username: string, password: string): Observable<User> {
    return this.db.authUser(username, password)
      .pipe(
        catchError((err) => {
          this.logging.warning(`Failed to auth user ${username}: ${err.error}`)
          return throwError(() => new Error('Username or password is incorrect'))
        }),
        tap(this.updateUserLogin.bind(this)));


    // const user = await firstValueFrom(this.db.findUserByUsername(username));
    // console.log(typeof user, user);
    // if (!user) return Error('Username or password is incorrect.');
    // else if (user.password !== password) return Error('Username or password is incorrect.');

    // this.logging.info(`Logging in user ${user.username}.`)
    // Cookies.set('currentUserId', JSON.stringify(user.id));
    // this.currentUserSubject.next(user);
    // return user;
  }

  logout() {
    this.logging.info(`Logging out user ${this.currentUserSubject.value.username}.`);
    Cookies.remove('currentUser');
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
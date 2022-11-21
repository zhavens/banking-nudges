
import { environment } from '@/environments/environment';
import { TEST_ACCOUNTS, TEST_CARDS, TEST_PAYEES, TEST_PAYMENTS, TEST_PERSONALIZATION } from '@/helpers/testdata';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { instanceToPlain, plainToClass, plainToInstance } from 'class-transformer';
import Cookies from 'js-cookie';
import { BehaviorSubject, map, Observable, of, tap, throwError } from 'rxjs';

import { User } from '../../models/user';
import { LoggingBaseService } from './logging.service';

const LOCAL_STORAGE_USER_KEY: string = 'users';
const COOKIE_CURRENT_USER_KEY: string = 'current_user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private localUsers: User[] = [];
  private currentUserSubject: BehaviorSubject<User>;
  public currentUserObs: Observable<User>;

  constructor(
    private http: HttpClient,
    private logging: LoggingBaseService) {

    this.localUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_KEY) || "[]").map((x: any) => plainToClass(User, x)) || [];

    this.currentUserSubject = new BehaviorSubject<User>(new User());
    this.currentUserObs = this.currentUserSubject.asObservable();

    var loggedUser = Cookies.get(COOKIE_CURRENT_USER_KEY);
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
    let idx = this.localUsers.findIndex((x: User) => x.username == user.username)
    if (idx == -1) {
      this.localUsers.push(user);
      this.updateLocal();
    }

    Cookies.set(COOKIE_CURRENT_USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  login(username: string, password: string): Observable<User> {
    for (let user of this.localUsers) {
      if (user.username == username && (password.length == 0 || user.password == password)) {
        this.updateUserLogin(user);
        return of(user);
      }
    }
    if (!environment.static) {
      return this.http.post('/api/auth', { username: username, password: password }, { headers: { responseType: 'json' } })
        .pipe(
          map((value) => {
            return plainToInstance(User, value)
          }),
          tap(this.updateUserLogin.bind(this)));
    }
    return throwError(() => new Error('Invalid username or password.'));
  }

  logout() {
    this.logging.info(`Logging out user ${this.currentUserSubject.value.username}.`);
    Cookies.remove(COOKIE_CURRENT_USER_KEY);
    this.currentUserSubject.next(new User());
  }

  register(user: User): Observable<User> {
    user.accounts = TEST_ACCOUNTS;
    user.cards = TEST_CARDS;
    user.payees = TEST_PAYEES;
    user.payments = TEST_PAYMENTS;
    user.payees[1].nickname = `${user.firstName}'s Account`
    user.personalization = TEST_PERSONALIZATION;
    // Don't show task modal on first login!
    user.personalization.showTasksModal = false;

    let idx = this.localUsers.findIndex((x: User) => x.username == user.username)
    if (idx > -1) {
      return throwError(() => new Error("User already registered."));
    }
    this.localUsers.push(user);
    this.updateLocal();
    return of(user);
  }

  updateUser(user: User): Observable<User> {
    if (user.username != this.currentUser?.username) {
      return throwError(() => new Error('May only modify current user.'));
    }

    for (let account of user.accounts) {
      account.transactions.sort((a, b) => { return b.date.valueOf() - a.date.valueOf() });
    }
    for (let card of user.cards) {
      card.transactions.sort((a, b) => { return b.date.valueOf() - a.date.valueOf() });
    }

    let idx = this.localUsers.findIndex((x: User) => x.username == user.username)
    if (idx == -1) {
      throwError(() => new Error('User can\'t be found.'));
    }
    this.localUsers[idx] = user;
    this.updateLocal();
    this.currentUserSubject.next(user);
    Cookies.set(COOKIE_CURRENT_USER_KEY, JSON.stringify(user));
    return of(user);
  }

  private updateLocal() {
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(instanceToPlain(this.localUsers)));
  }

  reset() {
    localStorage.clear();
  }
}
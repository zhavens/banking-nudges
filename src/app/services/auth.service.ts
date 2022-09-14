import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '@/models';
import { LocalDatabaseService } from './local_database.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private localdb: LocalDatabaseService, private http: HttpClient) {
    var storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(storedUser));
    } else {
      this.currentUserSubject = new BehaviorSubject<User>(new User());
    }
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    if (this.isLoggedIn) return this.currentUserSubject.value
    else return null;
  }

  public get isLoggedIn(): boolean {
    return this.currentUserSubject.value && this.currentUserSubject.value.username != "";
  }

  login(username: string, password: string): User | Error {
    const user = this.localdb.findUser(username);
    if (!user || user.password !== password) return Error('Username or password is incorrect.');;
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    return user;
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(new User());
  }
}
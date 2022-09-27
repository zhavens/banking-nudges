import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '@/models/user';
import { LocalDatabaseService } from './local_database.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUserTopic: Observable<User>;

  constructor(private localdb: LocalDatabaseService, private http: HttpClient) {
    let storedUserId = parseInt(localStorage.getItem('currentUserId') || '-1');
    let storedUser = this.localdb.findUser(storedUserId);
    if (storedUser) {
      this.currentUserSubject = new BehaviorSubject<User>(storedUser);
    } else {
      this.currentUserSubject = new BehaviorSubject<User>(new User());
    }
    this.currentUserTopic = this.currentUserSubject.asObservable();
  }

  public get currentUser(): User | undefined {
    if (this.isLoggedIn) return this.currentUserSubject.value
    else return undefined;
  }

  public get isLoggedIn(): boolean {
    return this.currentUserSubject.value && this.currentUserSubject.value.username != "";
  }

  login(username: string, password: string): User | Error {
    const user = this.localdb.findUserByUsername(username);
    if (!user || user.password !== password) return Error('Username or password is incorrect.');
    localStorage.setItem('currentUserId', JSON.stringify(user.id));
    this.currentUserSubject.next(user);
    return user;
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUserId');
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
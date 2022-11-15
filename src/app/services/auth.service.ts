import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';

import { User } from '../../models/user';
import { LocalCacheService } from './local_cache.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUserTopic: Observable<User>;

  constructor(private cache: LocalCacheService, private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(new User());
    this.currentUserTopic = this.currentUserSubject.asObservable();
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
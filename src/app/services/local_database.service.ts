import { Injectable } from '@angular/core';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { Observable, of, throwError } from 'rxjs';
import { User } from '../../models/user';
import { DatabaseService } from './database.service';
import { LoggingService } from './logging.service';

// array in local storage for registered users

@Injectable({
    providedIn: 'root'
})
export class LocalDatabaseService implements DatabaseService {
    private users: User[];

    constructor(private logging: LoggingService) {
        this.users = JSON.parse(localStorage.getItem('users') || "[]").map((x: any) => plainToClass(User, x)) || []
    }

    initialize(): void {
        this.logging.info('Initializing local database service.');
    }

    reset(): void { }

    authUser(username: string, password: string): Observable<User> {
        let idx = this.users.findIndex((x: User) => x.username == username)
        if (idx > -1 && this.users[idx].password == password) {
            return of(this.users[idx]);
        }
        return throwError(() => new Error('Invalid username or password.'));
    }

    registerUser(user: User): Observable<User> {
        let idx = this.users.findIndex((x: User) => x.username == user.username)
        if (idx > -1) {
            return throwError(() => new Error("User already registered."));
        }
        this.users.push(user);
        this.writeUsers();
        return of(user);
    };

    updateUser(user: User): Observable<boolean> {
        let idx = this.users.findIndex((x: User) => x.username == user.username)
        if (idx == -1) {
            this.users.push(user);
        } else {
            this.users[idx] = user;
        }
        this.writeUsers();
        return of(true);
    }

    private writeUsers() {
        localStorage.setItem('users', JSON.stringify(instanceToPlain(this.users)));
    }
}

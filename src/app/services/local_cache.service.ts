
import { Injectable } from '@angular/core';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { Observable, of, tap, throwError } from 'rxjs';
import { User } from '../../models/user';
import { DatabaseService } from './database.service';
import { LoggingService } from './logging.service';
import { RemoteDatabaseService } from './remote-database.service';

// let lastFetch: Date = new Date(localStorage.getItem('lastFetch') || 0)
// let nextId = 1;

@Injectable({
    providedIn: 'root'
})
export class LocalCacheService implements DatabaseService {
    private initialized: boolean = false;
    private initalizing: boolean = false;

    private users: User[];

    constructor(
        private db: RemoteDatabaseService,
        private logging: LoggingService) {
        this.users = JSON.parse(localStorage.getItem('users') || "[]").map((x: any) => plainToClass(User, x)) || [];
    }

    async initialize() { }

    async reset() {
        this.users = [];
        this.updateLocal();
        this.initialized = false;
        this.initialize();
    }

    private cacheUser(user: User) {
        console.log(`Caching user ${user.username}`, this);
        this.users.push(user);
        this.updateLocal();
    }

    authUser(username: string, password: string): Observable<User> {
        for (let user of this.users) {
            if (user.username == username && (password.length == 0 || user.password == password)) {
                return of(user);
            }
        }
        return this.db.authUser(username, password)
            .pipe(tap(this.cacheUser.bind(this)));
    }

    registerUser(user: User): Observable<User> {
        return throwError(() => new Error("Not yet implemented."));
    };

    updateUser(user: User): Observable<boolean> {
        let idx = this.users.findIndex((x: User) => x.username == user.username)
        if (idx == -1) {
            return of(false);
        }
        this.users[idx] = user;
        this.updateLocal();
        return of(true);
    }

    private updateLocal() {
        localStorage.setItem('users', JSON.stringify(instanceToPlain(this.users)));
    }

    private writeUsers() {
        // Push modified user data to the server?
    }
}

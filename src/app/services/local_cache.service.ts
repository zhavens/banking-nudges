import { Injectable } from '@angular/core';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { firstValueFrom, from, Observable } from 'rxjs';
import { User } from '../../models/user';
import { DatabaseService } from './database.service';
import { RemoteDatabaseService } from './remote-database.service';

// let lastFetch: Date = new Date(localStorage.getItem('lastFetch') || 0)
// let nextId = 1;


function localObservable<T>(val: T): Observable<T> {
    return new Observable((subscriber) => {
        subscriber.next(val);
        subscriber.complete();
    });
}

@Injectable({
    providedIn: 'root'
})
export class LocalCacheService implements DatabaseService {
    private initialized: boolean = false;
    private initalizing: boolean = false;

    private users: User[];

    constructor(private remoteDb: RemoteDatabaseService) {
        this.users = JSON.parse(localStorage.getItem('users') || "[]").map((x: any) => plainToClass(User, x)) || [];
    }

    async initialize() {
        if (this.initalizing) {
            setTimeout(this.initialize, 100);
        }
        if (this.initialized) return;

        this.initalizing = true;

        try {
            let remoteUsers = await firstValueFrom(this.remoteDb.getAllUsers())
            for (let rUser of remoteUsers) {
                if (this.users.findIndex((value) => { return value.id === rUser.id }) == -1) {
                    this.users.push(rUser);
                }
            }
            this.updateLocal();

            this.initialized = true;
            this.initalizing = false;
        } catch {
            // May run into issues with service lifetime? Should be a singleton,
            // but I'm not gonna try to debug this too closely right now.
            this.initialized = false;
            this.initalizing = false;
        }
    }

    async reset() {
        this.users = [];
        this.updateLocal();
        this.initialized = false;
        this.initialize();
    }

    getNextId(): Observable<number> {
        if (!this.initialized) this.initialize();
        return from([this.users.reduce((a: User, b: User) => a.id > b.id ? a : b).id + 1]);
    }

    getAllUsers(): Observable<User[]> {
        if (!this.initialized) this.initialize();
        return from([this.users]);
    }

    findUser(id: number): Observable<User | undefined> {
        if (!this.initialized) this.initialize();
        return from([this.users.find((x: any) => x.id === id)]);
    }

    findUserByUsername(username: string): Observable<User | undefined> {
        if (!this.initialized) this.initialize();
        return from([this.users.find((x: any) => x.username === username)]);
    }

    deleteUser(id: number): Observable<boolean> {
        if (!this.initialized) this.initialize();
        this.users = this.users.filter((x: any) => x.id !== id);
        this.updateLocal();
        return from([true]);
    }

    updateUser(user: User): Observable<boolean> {
        if (!this.initialized) this.initialize();
        let idx = this.users.findIndex((x: User) => x.id == user.id)
        if (idx == -1) {
            return from([false]);
        }
        this.users[idx] = user;
        this.updateLocal();
        return from([true]);
    }

    private updateLocal() {
        localStorage.setItem('users', JSON.stringify(instanceToPlain(this.users)));
    }

    private writeUsers() {
        // Push modified user data to the server?
    }
}

import { Injectable } from '@angular/core';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { Observable, of } from 'rxjs';
import { User } from '../../models/user';
import { DatabaseService } from './database.service';

// array in local storage for registered users
let users: User[] = JSON.parse(localStorage.getItem('users') || "[]").map((x: any) => plainToClass(User, x)) || [];
let nextId = 1;

@Injectable({
    providedIn: 'root'
})
export class LocalDatabaseService implements DatabaseService {
    constructor() { }

    getNextId(): Observable<number> {
        return of(users.reduce((a: User, b: User) => a.id > b.id ? a : b).id + 1);
    }

    getAllUsers(): Observable<User[]> {
        return of(users);
    }

    findUser(id: number): Observable<User | undefined> {
        return of(users.find((x: any) => x.id === id));
    }

    findUserByUsername(username: string): Observable<User | undefined> {
        return of(users.find((x: any) => x.username === username));
    }

    insertUser(user: User): User {
        user.id = users.length ? Math.max(...users.map((x: any) => x.id)) + 1 : 1;
        users.push(user);
        this.writeUsers();
        return user;
    }

    deleteUser(id: number): Observable<boolean> {
        users = users.filter((x: any) => x.id !== id);
        this.writeUsers();
        return of(true);
    }

    updateUser(user: User): Observable<boolean> {
        let idx = users.findIndex((x: User) => x.id == user.id)
        if (idx == -1) {
            return of(false);
        }
        users[idx] = user;
        this.writeUsers();
        return of(true);
    }

    private writeUsers() {
        localStorage.setItem('users', JSON.stringify(instanceToPlain(users)));
    }
}

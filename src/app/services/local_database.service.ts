import { User } from '@/models/user';
import { Injectable } from '@angular/core';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { MemoryDb, MinimongoDb } from 'minimongo';

// array in local storage for registered users
let users: User[] = JSON.parse(localStorage.getItem('users') || "[]").map((x: any) => plainToClass(User, x)) || [];
let nextId = 1;

@Injectable({
    providedIn: 'root'
})
export class LocalDatabaseService {
    private db: MemoryDb;

    constructor() {
        this.db = new MemoryDb();

        this.db.addCollection("users");
        this.db.addCollection("accounts");
        this.db.addCollection("cards");
        this.db.addCollection("transactions");
    }

    get database(): MinimongoDb {
        return this.database;
    }

    getNextId(): number {
        return users.reduce((a: User, b: User) => a.id > b.id ? a : b).id + 1;
    }

    getAllUsers(): User[] {
        return users;
    }

    findUser(id: number): User | undefined {
        return users.find((x: any) => x.id === id);
    }

    findUserByUsername(username: string): User | undefined {
        return users.find((x: any) => x.username === username);
    }

    insertUser(user: User): User {
        user.id = users.length ? Math.max(...users.map((x: any) => x.id)) + 1 : 1;
        users.push(user);
        this.writeUsers();
        return user;
    }

    deleteUser(id: number): boolean {
        users = users.filter((x: any) => x.id !== id);
        this.writeUsers();
        return true;
    }

    updateUser(user: User): boolean {
        let idx = users.findIndex((x: User) => x.id == user.id)
        if (idx == -1) {
            return false;
        }
        users[idx] = user;
        this.writeUsers();
        return true;
    }

    private writeUsers() {
        localStorage.setItem('users', JSON.stringify(instanceToPlain(users)));
    }
}

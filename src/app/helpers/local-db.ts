import { User } from '@/models';
import { Injectable } from '@angular/core';
import { MemoryDb, MinimongoDb } from 'minimongo';

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users') || "[]") || [];
let nextId = 1;

@Injectable({
    providedIn: 'root'
})
export class LocalDatabase {
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
        return users.reduce((a: User, b: User) => Math.max(a.id, b.id), -Infinity).id;
    }

    getAllUsers() {
        // this.db.collections["users"].find("*").fetch();
        return users;
    }

    findUser(username: string): User | null {
        // this.db.collections["users"].find({"username": username}).fetch();
        return users.find((x: any) => x.username === username);
    }

    insertUser(user: User) {
        // this.db.collections["users"].upsert(user, function (doc: any) {
        //     return doc.id;
        // });
        user.id = users.length ? Math.max(...users.map((x: any) => x.id)) + 1 : 1;
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        return user;
    }

    deleteUser(id: number) {
        users = users.filter((x: any) => x.id !== id);
        localStorage.setItem('users', JSON.stringify(users));
        return true;
        // return this.db.collections["users"].remove(id);
    }


}

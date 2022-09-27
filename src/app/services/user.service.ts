import { Injectable } from '@angular/core';

import { TEST_ACCOUNTS } from '@/models/account';
import { User } from '@/models/user';
import { AuthenticationService } from './auth.service';
import { LocalDatabaseService } from './local_database.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private localdb: LocalDatabaseService,
        private auth: AuthenticationService) { }

    getAll(): User[] {
        // return this.http.get<User[]>(`/users`);
        return this.localdb.getAllUsers();
    }

    findUser(id: number): User | undefined {
        return this.localdb.findUser(id);
    }

    register(user: User): User | Error {
        if (this.localdb.findUserByUsername(user.username)) {
            return Error('Username "' + user.username + '" is already taken');
        }
        // TODO(zhavens): Remove once account config is in?
        user.accounts = TEST_ACCOUNTS;
        return this.localdb.insertUser(user);
    }

    delete(id: number): boolean | Error {
        // return this.http.delete(`/users/${id}`);
        if (!this.auth.isLoggedIn) return Error('Not logged in!');
        if (this.auth.currentUser?.id == id) return Error("Can't delete current user!");
        return this.localdb.deleteUser(id);
    }

    updateUser(user: User): boolean {
        for (let account of user.accounts) {
            account.transactions.sort((a, b) => { return b.date.valueOf() - a.date.valueOf() });
        }

        if (!this.localdb.updateUser(user)) {
            return false;
        }
        if (this.auth.currentUser == user) {
            this.auth.updateUser(user);
        }
        return true;
    }
}
import { Injectable } from '@angular/core';

import { TEST_ACCOUNTS, TEST_CARDS, TEST_PAYEES } from '@/helpers/testdata';
import { User } from '../../models/user';
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
        user.accounts = TEST_ACCOUNTS;
        user.cards = TEST_CARDS;
        user.payees = TEST_PAYEES;
        // Don't show task modal on first login!
        user.personalization.showTasksModal = false;
        return this.localdb.insertUser(user);
    }

    delete(id: number): boolean | Error {
        if (!this.auth.isLoggedIn) return Error('Not logged in!');
        if (this.auth.currentUser?.id == id) return Error("Can't delete current user!");
        return this.localdb.deleteUser(id);
    }

    updateUser(user: User): boolean {
        // Sort transactions by 
        for (let account of user.accounts) {
            account.transactions.sort((a, b) => { return b.date.valueOf() - a.date.valueOf() });
        }
        for (let card of user.cards) {
            card.transactions.sort((a, b) => { return b.date.valueOf() - a.date.valueOf() });
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
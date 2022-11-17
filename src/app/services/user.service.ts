import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { TEST_ACCOUNTS, TEST_CARDS, TEST_PAYEES, TEST_PAYMENTS, TEST_PERSONALIZATION } from '../../helpers/testdata';
import { User } from '../../models/user';
import { AuthenticationService } from './auth.service';
import { DatabaseService } from './database.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(
        private db: DatabaseService,
        private auth: AuthenticationService) { }

    // getAll(): Observable<User[]> {
    //     return this.db.getAllUsers();
    // }

    // findUser(id: number): Observable<User | undefined> {
    //     return this.db.findUser(id);
    // }

    register(user: User): Observable<User> {
        user.accounts = TEST_ACCOUNTS;
        user.cards = TEST_CARDS;
        user.payees = TEST_PAYEES;
        user.payments = TEST_PAYMENTS;
        user.payees[1].nickname = `${user.firstName}'s Account`
        user.personalization = TEST_PERSONALIZATION;
        // Don't show task modal on first login!
        user.personalization.showTasksModal = false;
        return this.db.registerUser(user);
    }

    // delete(id: number): Observable<boolean | Error> {
    //     if (!this.auth.isLoggedIn) return of(Error('Not logged in!'));
    //     if (this.auth.currentUser?.id == id) return of(Error("Can't delete current user!"));
    //     return this.db.deleteUser(id);
    // }

    updateUser(user: User): Observable<boolean> {
        // Sort transactions by 
        for (let account of user.accounts) {
            account.transactions.sort((a, b) => { return b.date.valueOf() - a.date.valueOf() });
        }
        for (let card of user.cards) {
            card.transactions.sort((a, b) => { return b.date.valueOf() - a.date.valueOf() });
        }

        return this.db.updateUser(user).pipe(tap((resp: any) => {
            if (resp['status'] === 200 && this.auth.currentUser == user) {
                this.auth.updateUser(user);
            }
        }));
    }
}
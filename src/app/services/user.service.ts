import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, of, tap } from 'rxjs';

import { TEST_ACCOUNTS, TEST_CARDS, TEST_PAYEES, TEST_PERSONALIZATION } from '../../helpers/testdata';
import { User } from '../../models/user';
import { AuthenticationService } from './auth.service';
import { LocalCacheService } from './local_cache.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(
        private cache: LocalCacheService,
        private auth: AuthenticationService) { }

    getAll(): Observable<User[]> {
        return this.cache.getAllUsers();
    }

    findUser(id: number): Observable<User | undefined> {
        return this.cache.findUser(id);
    }

    async register(user: User): Promise<Observable<boolean | Error>> {
        let dupe = await firstValueFrom(this.cache.findUserByUsername(user.username))
        if (dupe) {
            return of(Error('Username "' + user.username + '" is already taken'));
        }
        user.id = await firstValueFrom(this.cache.getNextId())
        user.accounts = TEST_ACCOUNTS;
        user.cards = TEST_CARDS;
        user.payees = TEST_PAYEES;
        user.payees[1].nickname = `${user.firstName}'s Account`
        user.personalization = TEST_PERSONALIZATION;
        // Don't show task modal on first login!
        user.personalization.showTasksModal = false;
        return this.cache.updateUser(user);;
    }

    delete(id: number): Observable<boolean | Error> {
        if (!this.auth.isLoggedIn) return of(Error('Not logged in!'));
        if (this.auth.currentUser?.id == id) return of(Error("Can't delete current user!"));
        return this.cache.deleteUser(id);
    }

    updateUser(user: User): Observable<boolean> {
        // Sort transactions by 
        for (let account of user.accounts) {
            account.transactions.sort((a, b) => { return b.date.valueOf() - a.date.valueOf() });
        }
        for (let card of user.cards) {
            card.transactions.sort((a, b) => { return b.date.valueOf() - a.date.valueOf() });
        }

        return this.cache.updateUser(user).pipe(tap((resp: any) => {
            if (resp['status'] === 200 && this.auth.currentUser == user) {
                this.auth.updateUser(user);
            }
        }));
    }
}
import { Injectable } from '@angular/core';

import { User } from '@/models';
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

    register(user: User): User | Error {
        if (this.localdb.findUser(user.username)) {
            return Error('Username "' + user.username + '" is already taken');
        }
        // return this.http.post(`/users/register`, user);
        return this.localdb.insertUser(user);
    }

    delete(id: number): boolean | Error {
        // return this.http.delete(`/users/${id}`);
        if (!this.auth.isLoggedIn) return Error('Not logged in!');
        return this.localdb.deleteUser(id);
    }
}
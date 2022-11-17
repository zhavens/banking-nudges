import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import { map, Observable, tap, throwError } from 'rxjs';
import { User } from '../../models/user';
import { DatabaseService } from './database.service';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})
export class RemoteDatabaseService implements DatabaseService {
  constructor(private http: HttpClient, private logging: LoggingService) { }

  initialize(): void {
    this.logging.info('Initializing remote database service.');
  }

  reset(): void { }

  authUser(username: string, password: string): Observable<User> {
    return this.http.post('/api/auth', { username: username, password: password }, { headers: { responseType: 'json' } })
      .pipe(
        map((val) => {
          return plainToInstance(User, val)
        }),
        tap(console.log));
  }

  registerUser(user: User): Observable<User> {
    return throwError(() => new Error("Remote register not implemented."));
  };

  updateUser(user: User): Observable<boolean> {
    return throwError(() => new Error("Remote update not implemented."));
  }
}

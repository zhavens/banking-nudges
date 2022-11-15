import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isHttpError } from '@helpers/error_typing';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';
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

  getNextId(): Observable<number> {
    return this.http.get(`/api/users/nextid`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(map((resp) => {
      return parseInt(resp.toString());
    }));
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get(`/api/users`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(map((resp: any) => {
      return plainToInstance(User, <any[]>JSON.parse(resp));
    }));
  }

  findUser(id: number): Observable<User | undefined> {
    return this.http.get(`/api/user?id=${id}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(map((resp: any) => {
      resp = JSON.parse(resp);
      if (isHttpError(resp)) {
        return undefined;
      } else {
        return plainToInstance(User, resp);
      };
    }));
  }

  findUserByUsername(username: string): Observable<User | undefined> {
    return this.http.get(`/api/user?name=${username}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(map((resp: any) => {
      resp = JSON.parse(resp);
      if (typeof resp === 'object' && isHttpError(resp)) {
        return undefined;
      } else {
        return plainToInstance(User, resp);
      };
    }));
  }

  deleteUser(id: number): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  updateUser(user: User): Observable<boolean> {
    return this.http.post(`/api/user?id=${user.id}`, JSON.stringify(instanceToPlain(user)), {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(map((resp: any) => {
      resp = JSON.parse(resp);
      return !isHttpError(resp)
    }));
  }
}

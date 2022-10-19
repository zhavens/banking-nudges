import { User } from '@/models/user';
import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class RemoteDatabaseService implements DatabaseService {

  constructor() { }

  getNextId(): number {
    throw new Error('Method not implemented.');
  }
  getAllUsers(): User[] {
    throw new Error('Method not implemented.');
  }
  findUser(id: number): User | undefined {
    throw new Error('Method not implemented.');
  }
  findUserByUsername(username: string): User | undefined {
    throw new Error('Method not implemented.');
  }
  insertUser(user: User): User {
    throw new Error('Method not implemented.');
  }
  deleteUser(id: number): boolean {
    throw new Error('Method not implemented.');
  }
  updateUser(user: User): boolean {
    throw new Error('Method not implemented.');
  }
}

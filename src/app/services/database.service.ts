import { Observable } from "rxjs";
import { User } from "../../models/user";

export abstract class DatabaseService {
    abstract initialize(): void;

    abstract reset(): void;

    abstract getNextId(): Observable<number>;

    abstract getAllUsers(): Observable<User[]>;

    abstract findUser(id: number): Observable<User | undefined>;

    abstract findUserByUsername(username: string): Observable<User | undefined>;

    abstract deleteUser(id: number): Observable<boolean>;

    abstract updateUser(user: User): Observable<boolean>;
}
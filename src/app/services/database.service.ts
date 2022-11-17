import { Observable } from "rxjs";
import { User } from "../../models/user";

export abstract class DatabaseService {
    abstract initialize(): void;

    abstract reset(): void;

    abstract authUser(username: string, password: string): Observable<User>;

    abstract registerUser(user: User): Observable<User>;

    abstract updateUser(user: User): Observable<boolean>;
}
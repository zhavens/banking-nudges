import { Observable } from "rxjs";
import { User } from "../../models/user";

export interface DatabaseService {
    getNextId(): Observable<number>;

    getAllUsers(): Observable<User[]>;

    findUser(id: number): Observable<User | undefined>;

    findUserByUsername(username: string): Observable<User | undefined>;

    deleteUser(id: number): Observable<boolean>;

    updateUser(user: User): Observable<boolean>;
}
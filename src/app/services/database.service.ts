import { User } from "../../models/user";

export interface DatabaseService {
    getNextId(): number;

    getAllUsers(): User[];

    findUser(id: number): User | undefined;

    findUserByUsername(username: string): User | undefined;

    insertUser(user: User): User;

    deleteUser(id: number): boolean;

    updateUser(user: User): boolean;
}
import { AccountId } from "./entities";
import { Transaction } from "./transaction";

export enum AccountType {
    UNKNOWN,
    SAVINGS,
    CHEQUING,
}

export class Account {
    id: AccountId = new AccountId(1);
    type: AccountType = AccountType.UNKNOWN
    ownerUuid: number = -1;

    name: string = "";
    balance: number = 0;

    transactions?: Transaction[];
}
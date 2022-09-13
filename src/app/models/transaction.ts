import { Entity } from "./entities";

export enum TransactionType {
    UNKNOWN,
    DEBIT,
    CREDIT,
    ACH,
    ETRANSFER,
}

export class Transaction {
    type: TransactionType = TransactionType.UNKNOWN;
    date: Date = new Date();
    sender: Entity | undefined;
    recipient: Entity | undefined;
    amount: number = 0;
    description?: string;
    balance?: number;

    toString = (tx: Transaction): string => ""
}
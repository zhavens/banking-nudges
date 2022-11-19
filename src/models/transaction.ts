import { DecimalTransform, EntityType } from "@helpers/decorators";
import { Type } from "class-transformer";
import { Decimal } from "decimal.js";
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

    @Type(() => Date)
    date: Date = new Date();
    @EntityType()
    sender?: Entity;
    @EntityType()
    recipient?: Entity;

    description?: string;
    note?: string;

    @DecimalTransform()
    amount: Decimal = new Decimal(0);
    @DecimalTransform()
    balance?: Decimal;
}
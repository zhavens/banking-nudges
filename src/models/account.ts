import { DecimalTransform } from "../helpers/decorators";
import { Type } from "class-transformer";
import Decimal from "decimal.js";
import 'reflect-metadata';
import { AccountId, CreditCardId } from "./entities";
import { Transaction } from "./transaction";

export enum AccountType {
    UNKNOWN,
    SAVINGS,
    CHEQUING,
    CREDIT,
}

export class Account {
    @Type(() => AccountId)
    id: AccountId = new AccountId();
    type: AccountType = AccountType.UNKNOWN;

    name: string = '';

    @DecimalTransform()
    balance: Decimal = new Decimal(0.0);

    @Type(() => Transaction)
    transactions: Transaction[] = [];
}

export enum CardType {
    UNKNOWN,
    VISA,
    MASTERCARD,
    AMEX,
}

export class CreditCard {
    @Type(() => CreditCardId)
    id: CreditCardId = new CreditCardId(0);
    type: CardType = CardType.UNKNOWN;

    name: string = '';

    @DecimalTransform()
    limit: Decimal = new Decimal(0.0);

    @DecimalTransform()
    balance: Decimal = new Decimal(0.0);

    @Type(() => Transaction)
    transactions: Transaction[] = [];
}
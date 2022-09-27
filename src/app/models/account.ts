import { DecimalTransform } from "@/helpers/decorators";
import { plainToClass, Type } from "class-transformer";
import Decimal from "decimal.js";
import 'reflect-metadata';
import { AccountId, CreditCardId, EtransferClient, OtherEntity } from "./entities";
import { Transaction, TransactionType } from "./transaction";

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

export const TEST_ACCOUNTS: Account[] = [
    {
        id: plainToClass(AccountId, { accountNum: 1 }),
        type: AccountType.CHEQUING,
        name: "Account 1",
        balance: new Decimal(76.55),
        transactions: [{
            type: TransactionType.ETRANSFER,
            date: new Date(),
            sender: plainToClass(AccountId, { accountNum: 1 }),
            recipient: new EtransferClient("test", "test@mail.com"),
            amount: new Decimal(123.45),
            balance: new Decimal(76.55)
        },
        {
            type: TransactionType.DEBIT,
            date: new Date(),
            sender: new OtherEntity("Employer"),
            recipient: plainToClass(AccountId, { accountNum: 1 }),
            amount: new Decimal(200.00),
            balance: new Decimal(200.00),
        },]
    },
    {
        id: plainToClass(AccountId, { accountNum: 2 }),
        type: AccountType.SAVINGS,
        name: "Savings",
        balance: new Decimal(67.89),
        transactions: [
            {
                type: TransactionType.ETRANSFER,
                date: new Date(),
                sender: new EtransferClient("test", "test@mail.com"),
                recipient: plainToClass(AccountId, { accountNum: 2 }),
                amount: new Decimal(67.89),
                balance: new Decimal(67.89),
            }
        ]
    }
]
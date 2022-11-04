import { Account, AccountType, CardType, CreditCard } from "@models/account";
import { AccountId, CreditCardId, EtransferClient, OtherEntity } from "@models/entities";
import { Payment } from "@models/payment";
import { TransactionType } from "@models/transaction";
import { Payee, PersonalizationConfig, PersonalizationLevel } from "@models/user";
import { plainToClass, plainToInstance } from "class-transformer";
import Decimal from "decimal.js";
import * as uuid from "uuid";

export const TEST_ACCOUNTS: Account[] = [
    {
        id: plainToClass(AccountId, { accountNum: 17654 }),
        type: AccountType.CHEQUING,
        name: "Account 1",
        balance: new Decimal(876.55),
        transactions: [{
            type: TransactionType.ETRANSFER,
            date: new Date(),
            sender: plainToClass(AccountId, { accountNum: 17654 }),
            recipient: new EtransferClient("test", "test@mail.com"),
            amount: new Decimal(123.45),
            balance: new Decimal(876.55)
        },
        {
            type: TransactionType.DEBIT,
            date: new Date(),
            sender: new OtherEntity("Bank of Bank"),
            recipient: plainToClass(AccountId, { accountNum: 17654 }),
            amount: new Decimal(1000.00),
            balance: new Decimal(1000.00),
            description: "Initial deposit."
        },]
    },
    {
        id: plainToClass(AccountId, { accountNum: 22387 }),
        type: AccountType.SAVINGS,
        name: "Savings",
        balance: new Decimal(67.89),
        transactions: [
            {
                type: TransactionType.ETRANSFER,
                date: new Date(),
                sender: new EtransferClient("test", "test@mail.com"),
                recipient: plainToClass(AccountId, { accountNum: 22387 }),
                amount: new Decimal(67.89),
                balance: new Decimal(67.89),
            }
        ]
    }
]

export const TEST_CARDS: CreditCard[] = [
    {
        id: plainToClass(CreditCardId, {
            ccNum: 4510235656894321,
            expiryMonth: 4,
            expiryYear: 2025,
            cvc: 987,
        }),
        name: 'Visa Cash Back',
        type: CardType.VISA,
        limit: new Decimal(2000),
        balance: new Decimal(180.71),
        transactions: [
            {
                type: TransactionType.CREDIT,
                date: new Date(),
                sender: plainToClass(AccountId, { accountNum: 17654 }),
                description: "Partial payment.",
                amount: new Decimal(31.64),
                balance: new Decimal(180.71),
            },
            {
                type: TransactionType.DEBIT,
                date: new Date(),
                recipient: plainToClass(OtherEntity, { description: "Superstore INC." }),
                amount: new Decimal(212.35),
                balance: new Decimal(212.35)
            }
        ]
    }
];

export const TEST_PAYEES: Payee[] = [
    new Payee(new OtherEntity("TelcoWireless (76732110)"), "Telecom Wireless Inc."),
    new Payee(new AccountId(8557456125), "Close Other's Account"),
]

export const TEST_PAYMENTS: Payment[] = [
    {
        id: uuid.NIL,
        from: plainToInstance(AccountId, {
            accountNum: 1,
        }),
        to: plainToInstance(OtherEntity, {
            description: "TelcoWireless (76732110)"
        }),
        amount: new Decimal(45.89),
        frequency: "Monthly on the 15th"
    }
]

export const TEST_PERSONALIZATION: PersonalizationConfig = (() => {
    let config = new PersonalizationConfig();
    config.level = PersonalizationLevel.NAME;
    config.oaName = "Maggie";
    config.oaRelation = "mother";
    config.showTasksModal = true;
    return config
})();
import { EntityType } from "@/helpers/decorators";
import { Type } from "class-transformer";
import 'reflect-metadata';
import { Account, CreditCard } from "./account";
import { Address } from "./address";
import { Entity, OtherEntity } from "./entities";
import { Payment } from "./payment";

export class User {
    id: number = 0;
    username: string = "";
    password: string = "";
    firstName: string = "";
    lastName: string = "";
    admin: boolean = false;

    home_address?: Address;
    mailing_address?: Address;
    home_phone?: string;
    work_phone?: string;
    emails: string[] = [];

    @Type(() => Account)
    accounts: Account[] = [];

    @Type(() => CreditCard)
    cards: CreditCard[] = [];

    @Type(() => Payee)
    payees: Payee[] = [];

    @Type(() => Payment)
    payments: Payment[] = [];

    @Type(() => PersonalizationConfig)
    personalization: PersonalizationConfig = new PersonalizationConfig();
}

// export type PayeeTypes = AccountId | AchAccount | EtransferClient | OtherEntity;

export class Payee {
    @EntityType()
    id: Entity = new OtherEntity();

    nickname?: string = '';

    constructor(id: Entity, nickname?: string) {
        this.id = id;
        this.nickname = nickname;
    }

    safeString(): string {
        return this.nickname ? `${this.nickname} - ${this.id.safeString()}` : this.id.safeString();
    }
}

export class PersonalizationConfig {
    showTasksModal: boolean = true;
}
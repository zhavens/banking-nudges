
export interface Entity {
    equals(other: Entity): boolean;
    isValid(): boolean;
    safeString(): string;
}

export function isEntity(object: any): boolean {
    return 'safeString' in object;
}

export class OtherEntity implements Entity {
    description: string;

    constructor(description: string = "") {
        this.description = description;
    }

    equals(other: Entity): boolean {
        return other instanceof OtherEntity && this.description == other.description;
    }

    isValid(): boolean {
        return true;
    }

    safeString(): string {
        return this.description;
    }
}

export class AccountId implements Entity {
    accountNum: number;

    constructor(accountNum: number = 0) {
        this.accountNum = accountNum;
    }

    equals(other: Entity): boolean {
        return other instanceof AccountId && this.accountNum == other.accountNum;
    }

    isValid(): boolean {
        return this.accountNum > 0;
    }

    safeString(): string {
        return `00549-****${this.accountNum % 1000}`
    }
}

export class CreditCardId implements Entity {
    ccNum: number;
    expiryMonth: number;
    expiryYear: number;
    cvc: number;

    constructor(ccNum: number,
        expiryMonth: number = 1,
        expiryYear: number = 1970,
        cvc = 0) {
        this.ccNum = ccNum;
        this.expiryMonth = expiryMonth;
        this.expiryYear = expiryYear;
        this.cvc = cvc;
    }

    equals(other: Entity): boolean {
        return (other instanceof CreditCardId
            && this.ccNum == other.ccNum
            && this.expiryMonth == other.expiryMonth
            && this.expiryYear == other.expiryYear
            && this.cvc == other.cvc);
    }

    isValid(): boolean {
        let currDate = new Date();
        return this.ccNum > 0
            && (this.expiryYear > currDate.getFullYear() || (this.expiryYear == currDate.getFullYear() && this.expiryMonth > currDate.getMonth()))
            && this.cvc > 0 && this.cvc < 1000;
    }

    safeString(): string {
        return `Ending in ${this.ccNum % 10000}`
    }

    safeStringLong(): string {
        return `${(this.ccNum / 1000000000000).toFixed(0)} **** **** ${this.ccNum % 10000}`
    }
}

export class AchAccount implements Entity {
    institutionNum: number;
    routingNum: number;
    accountNum: number;

    constructor(name: string = "",
        routingNum: number = 0,
        institutionNum: number = 0,
        accountNum: number = 0) {
        this.institutionNum = institutionNum;
        this.routingNum = routingNum;
        this.accountNum = accountNum;
    }

    equals(other: Entity): boolean {
        return (other instanceof AchAccount
            && this.institutionNum == other.institutionNum
            && this.routingNum == other.routingNum
            && this.accountNum == other.accountNum);
    }

    isValid(): boolean {
        return (this.routingNum > 99999999 && (this.institutionNum > 0
            && this.routingNum < 1000000000)
            && this.institutionNum < 1000)
            && this.accountNum > 0;
    }

    safeString(): string {
        return `${this.routingNum}-****${this.accountNum % 1000}`
    }
}

export class EtransferClient implements Entity {
    email: string | undefined
    phoneNum: string | undefined;

    constructor(name?: string, email?: string, phoneNum?: string) {
        this.email = email;
        this.phoneNum = phoneNum;
    }

    equals(other: Entity): boolean {
        return other instanceof EtransferClient
            && ((this.email != undefined && this.email == other.email)
                || (this.phoneNum != undefined && this.phoneNum == other.phoneNum))
    }

    isValid(): boolean {
        return (this.email != null && this.email.isValidEmail())
            || (this.phoneNum != null && this.phoneNum.isValidPhone());
    }

    safeString(): string {
        if (this.email) return this.email
        else if (this.phoneNum) return this.phoneNum
        else return "INVALID"
    }
}

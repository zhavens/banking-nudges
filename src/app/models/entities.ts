
export interface Entity {
    equals(other: Entity): boolean;
    isValid(): boolean;
    safeString(): string;
}

export class TestEntity implements Entity {
    description: string;

    constructor(description: string = "") {
        this.description = description;
    }

    equals(other: Entity): boolean {
        return other instanceof TestEntity && this.description == other.description;
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
        return `******${this.accountNum % 1000}`
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
        return `Ending in ${this.ccNum % 1000}`
    }
}

export class AchAccount implements Entity {
    name: string;
    routingNum: number;
    institutionNum: number;
    accountNum: number;

    constructor(name: string = "",
        routingNum: number = 0,
        institutionNum: number = 0,
        accountNum: number = 0) {
        this.name = name;
        this.routingNum = routingNum;
        this.institutionNum = institutionNum;
        this.accountNum = accountNum;
    }

    equals(other: Entity): boolean {
        return (other instanceof AchAccount
            && this.routingNum == other.routingNum
            && this.institutionNum == other.institutionNum
            && this.accountNum == other.accountNum);
    }

    isValid(): boolean {
        return (this.routingNum > 99999999 && this.routingNum < 1000000000)
            && (this.institutionNum > 0 && this.institutionNum < 1000)
            && this.accountNum > 0;
    }

    safeString(): string {
        if (this.name) return this.name
        else return `${this.routingNum} ****${this.accountNum % 1000}`
    }
}

export class EtransferClient implements Entity {
    name: string | undefined;
    email: string | undefined
    phoneNum: string | undefined;

    constructor(name?: string, email?: string, phoneNum?: string) {
        this.name = name;
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
        if (this.name) return this.name
        else if (this.email) return this.email
        else if (this.phoneNum) return this.phoneNum
        else return "INVALID"
    }
}


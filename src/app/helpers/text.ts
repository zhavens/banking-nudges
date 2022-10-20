import { AccountType, CardType } from "../../models/account";
import Decimal from "decimal.js";

// Create our number formatter.
var currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'CAD',
    currencyDisplay: 'narrowSymbol',
});

export const accountTypeString = (type: AccountType | undefined) => {
    if (!type) {
        return "";
    }
    return AccountType[type];
}

export const cardTypeString = (type: CardType | undefined) => {
    if (!type) {
        return "";
    }
    return CardType[type];
}

declare global {
    interface Number {
        currencyString: () => string;
    }

    interface String {
        isValidEmail: () => boolean;
        isValidPhone: () => boolean;
    }
}

Number.prototype.currencyString = function (): string {
    return currencyFormatter.format((this.valueOf()));
}


String.prototype.isValidEmail = function (): boolean {
    return this.toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) != null;
};

String.prototype.isValidPhone = function (): boolean {
    return this.toLowerCase()
        .match(
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
        ) != null;
};

declare module "decimal.js" {
    interface Decimal {
        currencyString: () => string;
    }
}
Decimal.prototype.currencyString = function (): string {
    return currencyFormatter.format((this.toNumber()));
}
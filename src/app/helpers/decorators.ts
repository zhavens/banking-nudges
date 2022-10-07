import { AccountId, AchAccount, CreditCardId, EtransferClient, OtherEntity } from "@/models/entities";
import { Transform, Type } from "class-transformer";
import Decimal from "decimal.js";

export function DecimalTransform() {
    return Transform(({ value }) => {
        if (typeof value == 'object') {
            value.toStringTag = '[object Decimal]';
        }
        return new Decimal(value);
    })
}

export function EntityType(): PropertyDecorator {
    return Type(() => Object, {
        discriminator: {
            property: '__type',
            subTypes: [
                { value: OtherEntity, name: 'other' },
                { value: AccountId, name: 'account' },
                { value: AchAccount, name: 'ach' },
                { value: EtransferClient, name: 'etransfer' },
                { value: CreditCardId, name: 'cc' },
            ],
        },
        keepDiscriminatorProperty: true,
    })
}
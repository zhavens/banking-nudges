import { DecimalTransform, EntityType } from "@/helpers/decorators";
import Decimal from "decimal.js";
import { Entity, OtherEntity } from "./entities";

export class Payment {
    id: string = '';

    @EntityType()
    from: Entity = new OtherEntity();

    @EntityType()
    to: Entity = new OtherEntity();

    @DecimalTransform()
    amount: Decimal = new Decimal(0.0);

    frequency: string = '';

    description?: string;
}
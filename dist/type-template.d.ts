import { Validator } from "./validator";
export declare class TypeTemplate<I, O, C> {
    validator: Validator<I, O, C>;
    conditions: C;
    constructor(validator: Validator<I, O, C>, conditions: C);
}

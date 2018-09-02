import { TypeTemplate } from "./type-template";
export declare class FieldTemplate {
    keys: string[];
    type: TypeTemplate<any, any, any>;
    constructor(keys: string[], type: TypeTemplate<any, any, any>);
}

import { ValidatorDictionary, ObjectValidator, ModelValidator, MultipleValidator, ArrayValidator } from "./validator";
import { TypeTemplate } from "./type-template";
export declare class EasyValid {
    validators: ValidatorDictionary;
    constructor(validators: ValidatorDictionary);
    multipleValidator: MultipleValidator<any>;
    objectValidator: ObjectValidator<any>;
    modelValidator: ModelValidator<any>;
    arrayValidator: ArrayValidator<any>;
    parseKeys(rawKeys: string): string[];
    parseTypes(rawTypes: string): TypeTemplate<any, any, any>;
    parseTemplate(template: any): TypeTemplate<any, any, any>;
}

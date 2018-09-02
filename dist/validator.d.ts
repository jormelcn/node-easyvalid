import { FieldTemplate } from "./field-template";
import { TypeTemplate } from "./type-template";
export interface Validator<I, C, O> {
    (value: I, conditions: C): O;
}
export interface ModelConditions {
    model: Function;
    template: TypeTemplate<any, any, any>;
}
export interface ValueValidator<O> extends Validator<string, string[], O> {
}
export interface MultipleValidator<O> extends Validator<string, TypeTemplate<any, O, any>[], O> {
}
export interface ArrayValidator<O> extends Validator<any, TypeTemplate<any, O, any>[], O[]> {
}
export interface ModelValidator<O> extends Validator<any, ModelConditions, O> {
}
export interface ModelArrayValidator<O> extends Validator<any[], ModelConditions, O[]> {
}
export interface ObjectValidator<O> extends Validator<any, FieldTemplate[], O> {
}
export interface ObjectArrayValidator<O> extends Validator<any[], FieldTemplate[], O[]> {
}
export declare class ValidatorDictionary {
    [key: string]: ValueValidator<any>;
}

import { TypeTemplate } from "./type-template";

export class FieldTemplate {
  constructor(
    public keys : string [], 
    public type : TypeTemplate<any, any, any>
  ){

  }
}
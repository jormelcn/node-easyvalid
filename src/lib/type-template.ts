import { Validator } from "./validator";

export class TypeTemplate<I, O, C> {
  constructor(
    public validator : Validator<I, O, C>,
    public conditions : C
  ){

  }
}
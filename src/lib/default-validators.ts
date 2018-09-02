import { ValueValidator } from "./validator";
import { ValidatorDictionary } from "./validator";
import { EasyError } from "easyerror";

const numericValidator : ValueValidator<number> = (value, conditions) => {
  if(typeof value != 'number' && typeof value != 'string') throw new EasyError('Invalid Number');
  let out = +value;
  if(isNaN(out)) throw new EasyError('Invalid Number');
  return out;
}

const stringValidator : ValueValidator<string> = (value, conditions) => {
  if(typeof value != 'number' && typeof value != 'string') throw new EasyError('Invalid String');
  return ''+value;
}

export const defaultValidators : ValidatorDictionary = {
  'numeric' : numericValidator,
  'string'  : stringValidator
}
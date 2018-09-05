import { ObjectValidator, ModelValidator, MultipleValidator, ArrayValidator } from "./validator";
import { ValueValidator } from "./validator";
import { ValidatorDictionary } from "./validator";
import { EasyError } from "easyerror";

export const multipleValidator : MultipleValidator<any> = (value, types) : any => {
  let errorsMessages : string[] = [];
  let out;
  for(let j = 0; j < types.length; j++) {
    try{
      out = types[j].validator(value, types[j].conditions);
      break;
    }catch(e){
      if(e instanceof EasyError)
        errorsMessages.push(`${e.getTrace()} ${e.message}`);
      else
        errorsMessages.push(e.message);
    }
  }
  if(errorsMessages.length >= types.length){
    throw new EasyError(`not satisfy any conditions: {\n${errorsMessages.join('\n')}}`);
  }
  return out;
}

export const objectValidator : ObjectValidator<any> = (value, conditions) => {
  if(typeof value !== 'object' || value instanceof Array) throw new EasyError('Value is not an Object');
  let out = {};
  for(let i = 0; i < conditions.length; i++){
    let keys = conditions[i].keys;
    let type = conditions[i].type;
    let foundKey = null;
    for(let j = 0; j < keys.length; j++){
      if(keys[j] in value){
        foundKey = keys[j];
        break;
      }
    }
    let toEvaluate, evaluationResult;
    if(foundKey)  toEvaluate = value[foundKey];
    try{
      evaluationResult = type.validator(toEvaluate, type.conditions);
      if(foundKey) out[keys[0]] = evaluationResult;
    }catch(e){
      if(e instanceof EasyError)
        e.addTrace(keys[0])
      throw e;
    }
  }
  return out;
};

export const modelValidator : ModelValidator<any> = (value, conditions) => {
  let object = this.objectValidator(value, conditions.template.conditions);
  object.__proto__ = conditions.model.prototype;
  return object;
}

export const arrayValidator : ArrayValidator<any> = (values, types) => {
  if(!(values instanceof Array)) throw new EasyError('Value is not Array');
  let i = 0, elements = [];
  try{
    if(types.length > 1){
      for(i = 0; i < values.length; i++)
        elements.push(this.multipleValidator(values[i], types));  
    } else {
      for(i = 0; i < values.length; i++)
        elements.push(types[0].validator(values[i], types[0].conditions));  
    }
  }catch(e){
    if(e instanceof EasyError)
      e.addTrace(`[${i}]`);
    throw e;
  }
  return elements;
}

/*Default Value Validators*/

const numericValidator : ValueValidator<number> = (value, conditions) => {
  if(typeof value != 'number' && typeof value != 'string') throw new EasyError(`Invalid Number`);
  let out = +value;
  if(isNaN(out)) throw new EasyError('Invalid Number');
  return out;
}

const stringValidator : ValueValidator<string> = (value, conditions) => {
  if(typeof value != 'number' && typeof value != 'string') throw new EasyError('Invalid String');
  return ''+value;
}

const nullValidator : ValueValidator<any> = (value, conditions) => {
  if(value !== null) throw new EasyError('Invalid Null Value');
  return null;
}

const undefinedValidator : ValueValidator<any> = (value, conditions) => {
  if(typeof value != 'undefined') throw new EasyError('Invalid Undefined Value');
}

export const valueValidators : ValidatorDictionary = {
  'numeric' : numericValidator,
  'string'  : stringValidator,
  'undefined' : undefinedValidator,
  'null' : nullValidator
};
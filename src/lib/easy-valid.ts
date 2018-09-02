import { ValidatorDictionary, ObjectValidator, ObjectArrayValidator, ModelValidator, ModelArrayValidator, ModelConditions, MultipleValidator, ArrayValidator } from "./validator";
import { defaultValidators } from './default-validators';
import { TypeTemplate } from "./type-template";
import { FieldTemplate } from "./field-template";
import { EasyError } from 'easyerror';

export class EasyValid {

  validators : ValidatorDictionary;

  constructor(
    validators : ValidatorDictionary
  ){
    this. validators = Object.assign(defaultValidators, validators);
  }

  multipleValidator : MultipleValidator<any> = (value, types) : any => {
    let errorsMessages : string[] = [];
    let out;
    for(let j = 0; j < types.length; j++) {
      try{
        out = types[j].validator(value, types[j].conditions);
        break;
      }catch(e){
        errorsMessages.push(e.message);
      }
    }
    if(errorsMessages.length >= types.length){
      throw new EasyError(`not satisfy conditions: \n${errorsMessages.join('\n')}`);
    }
    return out;
  }

  objectValidator : ObjectValidator<any> = (value, conditions) => {
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
        e.message = `Field ${keys.join('|')} not satisfy conditions: ${e.message}`
        throw e;
      }
    }
    return out;
  };

  modelValidator : ModelValidator<any> = (value, conditions) => {
    let object = this.objectValidator(value, conditions.template.conditions);
    object.__proto__ = conditions.model.prototype;
    return object;
  }

  arrayValidator : ArrayValidator<any> = (values, types) => {
    if(!(values instanceof Array)) throw new EasyError('Value is not Array');
    let elements = [];
    for(let i = 0; i < values.length; i++){
      elements.push(this.multipleValidator(values[i], types));
    }
    return elements;
  }

  parseKeys(rawKeys : string) : string [] {
    return rawKeys.split('|');
  }

  parseTypes(rawTypes : string) : TypeTemplate<any, any, any> {
    let rawTypesSplit = rawTypes.split('|');
    let typesTemplates : TypeTemplate<any, any, any>[] = [];
    for(let i = 0; i < rawTypesSplit.length; i++) {
      let conditions = rawTypesSplit[i].split(':');
      let validator = this.validators[conditions[0]];
      if(!validator) throw new EasyError(`Validator ${conditions[0]} not found`);
      conditions.shift();
      let type = new TypeTemplate<any, any, any>(validator, conditions);
      typesTemplates.push(type);
    }
    return {
      validator : this.multipleValidator,
      conditions : typesTemplates
    };
  }

  parseTemplate(template : any) : TypeTemplate<any, any, any>{
    let fieldTemplates = [];
    if(typeof template === 'string'){
      return this.parseTypes(template);
    }
    else if(typeof template === 'function'){
      if(!template.$template) throw new EasyError(`Template for Model ${template.name} not found`);
        //TODO Verificar que el template sea acorde al modelo
        let modelConditions : ModelConditions = {
          model : template,
          template : this.parseTemplate(template.$template)
        }
        return {
          conditions : modelConditions,
          validator : this.modelValidator
        };
    }
    else if(template instanceof Array){
      if(template.length < 1) throw new EasyError(`Invalid array Template`);
      let conditions = [];
      for(let i = 0; i < template.length; i++){
        conditions.push(this.parseTemplate(template[i]));
      }
      return  {
        validator : this.arrayValidator,
        conditions : conditions
      };
    }
    else if(typeof template === 'object') {
      let conditions : FieldTemplate[] = []
      for(let key in template){
        conditions.push(new FieldTemplate(this.parseKeys(key), this.parseTemplate(template[key])));
      }
      return {
        conditions : conditions,
        validator : this.objectValidator
      };
    }
    else{
      throw new EasyError(`Invalid Template`);
    }
  }

}
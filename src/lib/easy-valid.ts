import { ValidatorDictionary, ModelConditions } from "./validator";
import { valueValidators, multipleValidator, modelValidator, objectValidator, arrayValidator } from './default-validators';
import { TypeTemplate } from "./type-template";
import { FieldTemplate } from "./field-template";
import { EasyError } from 'easyerror';

export class EasyValid {

  validators : ValidatorDictionary;

  constructor(
    validators : ValidatorDictionary
  ){
    this. validators = Object.assign(valueValidators, validators);
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
      validator : multipleValidator,
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
          validator : modelValidator
        };
    }
    else if(template instanceof Array){
      if(template.length < 1) throw new EasyError(`Invalid array Template`);
      let conditions = [];
      for(let i = 0; i < template.length; i++){
        conditions.push(this.parseTemplate(template[i]));
      }
      return  {
        validator : arrayValidator,
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
        validator : objectValidator
      };
    }
    else{
      throw new EasyError(`Invalid Template`);
    }
  }

}
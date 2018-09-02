"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const default_validators_1 = require("./default-validators");
const type_template_1 = require("./type-template");
const field_template_1 = require("./field-template");
const easyerror_1 = require("easyerror");
class EasyValid {
    constructor(validators) {
        this.multipleValidator = (value, types) => {
            let errorsMessages = [];
            let out;
            for (let j = 0; j < types.length; j++) {
                try {
                    out = types[j].validator(value, types[j].conditions);
                    break;
                }
                catch (e) {
                    errorsMessages.push(e.message);
                }
            }
            if (errorsMessages.length >= types.length) {
                throw new easyerror_1.EasyError(`not satisfy conditions: \n${errorsMessages.join('\n')}`);
            }
            return out;
        };
        this.objectValidator = (value, conditions) => {
            if (typeof value !== 'object' || value instanceof Array)
                throw new easyerror_1.EasyError('Value is not an Object');
            let out = {};
            for (let i = 0; i < conditions.length; i++) {
                let keys = conditions[i].keys;
                let type = conditions[i].type;
                let foundKey = null;
                for (let j = 0; j < keys.length; j++) {
                    if (keys[j] in value) {
                        foundKey = keys[j];
                        break;
                    }
                }
                let toEvaluate, evaluationResult;
                if (foundKey)
                    toEvaluate = value[foundKey];
                try {
                    evaluationResult = type.validator(toEvaluate, type.conditions);
                    if (foundKey)
                        out[keys[0]] = evaluationResult;
                }
                catch (e) {
                    e.message = `Field ${keys.join('|')} not satisfy conditions: ${e.message}`;
                    throw e;
                }
            }
            return out;
        };
        this.modelValidator = (value, conditions) => {
            let object = this.objectValidator(value, conditions.template.conditions);
            object.__proto__ = conditions.model.prototype;
            return object;
        };
        this.arrayValidator = (values, types) => {
            if (!(values instanceof Array))
                throw new easyerror_1.EasyError('Value is not Array');
            let elements = [];
            for (let i = 0; i < values.length; i++) {
                elements.push(this.multipleValidator(values[i], types));
            }
            return elements;
        };
        this.validators = Object.assign(default_validators_1.defaultValidators, validators);
    }
    parseKeys(rawKeys) {
        return rawKeys.split('|');
    }
    parseTypes(rawTypes) {
        let rawTypesSplit = rawTypes.split('|');
        let typesTemplates = [];
        for (let i = 0; i < rawTypesSplit.length; i++) {
            let conditions = rawTypesSplit[i].split(':');
            let validator = this.validators[conditions[0]];
            if (!validator)
                throw new easyerror_1.EasyError(`Validator ${conditions[0]} not found`);
            conditions.shift();
            let type = new type_template_1.TypeTemplate(validator, conditions);
            typesTemplates.push(type);
        }
        return {
            validator: this.multipleValidator,
            conditions: typesTemplates
        };
    }
    parseTemplate(template) {
        let fieldTemplates = [];
        if (typeof template === 'string') {
            return this.parseTypes(template);
        }
        else if (typeof template === 'function') {
            if (!template.$template)
                throw new easyerror_1.EasyError(`Template for Model ${template.name} not found`);
            //TODO Verificar que el template sea acorde al modelo
            let modelConditions = {
                model: template,
                template: this.parseTemplate(template.$template)
            };
            return {
                conditions: modelConditions,
                validator: this.modelValidator
            };
        }
        else if (template instanceof Array) {
            if (template.length < 1)
                throw new easyerror_1.EasyError(`Invalid array Template`);
            let conditions = [];
            for (let i = 0; i < template.length; i++) {
                conditions.push(this.parseTemplate(template[i]));
            }
            return {
                validator: this.arrayValidator,
                conditions: conditions
            };
        }
        else if (typeof template === 'object') {
            let conditions = [];
            for (let key in template) {
                conditions.push(new field_template_1.FieldTemplate(this.parseKeys(key), this.parseTemplate(template[key])));
            }
            return {
                conditions: conditions,
                validator: this.objectValidator
            };
        }
        else {
            throw new easyerror_1.EasyError(`Invalid Template`);
        }
    }
}
exports.EasyValid = EasyValid;
//# sourceMappingURL=easy-valid.js.map
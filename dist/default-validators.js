"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const easyerror_1 = require("easyerror");
const numericValidator = (value, conditions) => {
    if (typeof value != 'number' && typeof value != 'string')
        throw new easyerror_1.EasyError('Invalid Number');
    let out = +value;
    if (isNaN(out))
        throw new easyerror_1.EasyError('Invalid Number');
    return out;
};
const stringValidator = (value, conditions) => {
    if (typeof value != 'number' && typeof value != 'string')
        throw new easyerror_1.EasyError('Invalid String');
    return '' + value;
};
exports.defaultValidators = {
    'numeric': numericValidator,
    'string': stringValidator
};
//# sourceMappingURL=default-validators.js.map
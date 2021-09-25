import { forEach, get, has, isFunction, set } from "lodash";
//
import { FieldErrors, FieldScheme, ObjectSchema } from "utils/api/validator/types";

const validateObject = (object: any, schema: ObjectSchema) => {
    const errors: FieldErrors = {};
    forEach(schema, (fieldScheme: FieldScheme) => {
        const { key, validators } = fieldScheme;
        const field = get(object, `[${key}]`, null);

        forEach(validators, ({ validatorFunction, message }) => {
            if (isFunction(validatorFunction)) {
                const validationResult = validatorFunction(field);
                const hasFieldKey = has(errors, key);
                if (!validationResult && !hasFieldKey) {
                    set(errors, key, [message]);
                } else if (!validationResult && hasFieldKey) {
                    set(errors, key, message);
                }
            }
        });
    });
    return errors;
};

export default validateObject;

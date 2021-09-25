import { createMaxLength, createMinLength, isArray, isEmail, isNumber, required } from "utils/api/validator/validators";

export const createRequiredPreset = (field: string) => ({
    validatorFunction: required,
    message: `${field} cannot be empty.`
});

export const createIsNumberPreset = (field: string) => ({
    validatorFunction: isNumber,
    message: `${field} must be a number.`
});

export const createMinLengthPreset = (field: string | number, minLength = 2) => ({
    validatorFunction: createMinLength(minLength),
    message: `${field} must be at least ${minLength} characters.`
});

export const createMaxLengthPreset = (field: string | number, maxLength = 50) => ({
    validatorFunction: createMaxLength(maxLength),
    message: `${field} must be at most ${maxLength} characters.`
});

export const createIsEmailPreset = (field: string) => ({
    validatorFunction: isEmail,
    message: `${field} is not a valid email.`
});

export const createIsArrayPreset = (field: string) => ({
    validatorFunction: isArray,
    message: `${field} must be an array.`
});

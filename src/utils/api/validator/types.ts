export type Validator = {
    validatorFunction: Function;
    message: string;
};

export type FieldScheme = {
    key: string;
    validators: Validator[];
};

export type ObjectSchema = {
    [key: string]: FieldScheme;
};

export type FieldErrors = {
    [key: string]: string[];
};

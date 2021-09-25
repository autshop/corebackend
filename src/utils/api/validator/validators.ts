import { isNumber as lodashIsNumber, toString, toLower, isArray as lodashIsArray } from "lodash";

export const createMinLength = (minLength: number = 2) => (field: string | number) =>
    (toString(field) || "").length >= minLength;

export const createMaxLength = (maxLength: number = 2) => (field: string | number) =>
    (toString(field) || "").length <= maxLength;

export const required = (field: string) => !!field;

export const isNumber = (field: string | number) => lodashIsNumber(Number(field));

export const isEmail = (field: string) =>
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        toLower(toString(field))
    );

export const isArray = (field: any) => lodashIsArray(field);

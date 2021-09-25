import { NextFunction, Request, Response } from "express";
import { keys } from "lodash";
//
import { FieldErrors, ObjectSchema } from "utils/api/validator/types";
import { BadRequestResponse } from "utils/api/response";
import validateObject from "utils/api/validator";

export const createRequestParamsValidator = (paramsScheme: ObjectSchema) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validateObject(req?.params || {}, paramsScheme);
    if (keys(errors).length > 0) {
        return new BadRequestResponse<FieldErrors>("Validation failed.", errors).send(res);
    }
    return next();
};

export const createRequestBodyValidator = (bodyScheme: ObjectSchema) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validateObject(req?.body || {}, bodyScheme);
    if (keys(errors).length > 0) {
        return new BadRequestResponse<FieldErrors>("Validation failed.", errors).send(res);
    }
    return next();
};

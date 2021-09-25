import { Request, Response, NextFunction } from "express";
import { BadRequestResponse } from "../response";

const createAsyncController = (bodyFn: (req: Request, res: Response, next: NextFunction) => void) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        return await bodyFn(req, res, next);
    } catch (error) {
        console.log(error);
        //TODO REMOVE SENDING THIS ERROR IN PRODUCTION
        return new BadRequestResponse<string[]>("Unexpected error.", ["Unexpected error."]).send(error);
    }
};

export default createAsyncController;

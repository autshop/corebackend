import { NextFunction, Request, Response } from "express";
//
import JWTService from "services/jwt";
import { UnauthorizedResponse } from "utils/api/response";
import getJWTTokenFromRequest from "utils/helpers/getJWTTokenFromRequest";

const verifyJWTMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    const token = getJWTTokenFromRequest(request);

    if (!token) {
        return new UnauthorizedResponse<string>("Unauthorized.", "Unauthorized.").send(response);
    }

    try {
        await JWTService.verifyToken(token);
        return next();
    } catch (e) {
        return new UnauthorizedResponse<string>("Unauthorized.", "Unauthorized.").send(response);
    }
};

export default verifyJWTMiddleware;

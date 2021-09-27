import { Request } from "express";
//
import getJWTTokenFromRequest from "utils/helpers/getJWTTokenFromRequest";
import JWTService from "services/jwt";
import AuthService from "services/db/auth";

const getUserFromRequest = async (request: Request) => {
    const currentTokenString = getJWTTokenFromRequest(request);
    const currentToken = (await JWTService.verifyToken(currentTokenString)) as { email: string };

    return (await AuthService.getUserByEmail(currentToken?.email || "")) || null;
};

export default getUserFromRequest;

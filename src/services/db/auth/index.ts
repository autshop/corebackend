import { Request } from "express";
//
import User, { UserCreationAttributes } from "db/models/user";
import getJWTTokenFromRequest from "utils/helpers/getJWTTokenFromRequest";
import JWTService from "services/jwt";

class AuthService {
    public static getUserById = async (userId: number) => {
        return await User.findOne({
            where: { id: userId }
        });
    };

    public static getUserByEmail = async (email: string) => {
        return await User.findOne({
            where: { email }
        });
    };

    public static createUser = async (userCreationAttributes: UserCreationAttributes) => {
        return await User.create(userCreationAttributes);
    };

    public static getUserFromExpressRequest = async (request: Request) => {
        const currentTokenString = getJWTTokenFromRequest(request);
        const currentToken = (await JWTService.verifyToken(currentTokenString)) as { email: string };

        return await AuthService.getUserByEmail(currentToken?.email || "");
    };
}

export default AuthService;

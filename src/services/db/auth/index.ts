import User, { UserCreationAttributes } from "db/models/user";
import { Request } from "express";
import getJWTTokenFromRequest from "../../../utils/helpers/getJWTTokenFromRequest";
import JWTService from "../../jwt";

const getUserById = async (userId: number) => {
    return await User.findOne({
        where: { id: userId }
    });
};

const getUserByEmail = async (email: string) => {
    return await User.findOne({
        where: { email }
    });
};

const createUser = async (userCreationAttributes: UserCreationAttributes) => {
    return await User.create(userCreationAttributes);
};

//TODO find better solution (middleware maybe)
const getUserFromExpressRequest = async (request: Request) => {
    const currentTokenString = getJWTTokenFromRequest(request);
    const currentToken = (await JWTService.verifyToken(currentTokenString)) as { email: string };

    return await AuthService.getUserByEmail(currentToken?.email || "");
};

const AuthService = {
    getUserById,
    createUser,
    getUserByEmail,
    getUserFromExpressRequest
};

export default AuthService;

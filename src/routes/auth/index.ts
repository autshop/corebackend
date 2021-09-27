import { Router } from "express";
import bcrypt from "bcrypt";
//
import { createRequestBodyValidator } from "middlewares/createRequestBodyValidator";
import createAsyncController from "middlewares/createAsyncController";
import { UserCreationAttributes } from "db/models/user";
import AuthService from "services/db/auth";
import { BadRequestResponse, CreatedResponse, OKResponse, UnauthorizedResponse } from "utils/api/response";
import validatorSchemas from "utils/api/validator/schemes";
import { AuthPostLoginDTO, AuthPostRegisterDTO, AuthTokenResponse, UserGetDTO } from "dto/auth";
import JWTService from "services/jwt";
import verifyJWTMiddleware from "middlewares/verifyJWTMiddleware";
import getUserFromRequest from "utils/helpers/getUserFromRequest";
import ResponseMessages from "utils/helpers/responseMessages";

const router = Router();

router.post(
    "/register",
    createRequestBodyValidator(validatorSchemas.body.authPostRegisterBody),
    createAsyncController(async (request, response) => {
        const { email, password, passwordAgain }: AuthPostRegisterDTO = request.body;

        if (password !== passwordAgain) {
            return new BadRequestResponse<string>(
                ResponseMessages.PASSWORDS_DO_NOT_MATCH,
                ResponseMessages.PASSWORDS_DO_NOT_MATCH
            ).send(response);
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const userCreationAttributes: UserCreationAttributes = {
            email,
            passwordHash
        };

        const user = await AuthService.createUser(userCreationAttributes);

        const token = await JWTService.generateToken<UserGetDTO>({ email: user.email });
        return new CreatedResponse<AuthTokenResponse>(ResponseMessages.USER_CREATED_SUCCESSFULLY, {
            token: String(token)
        }).send(response);
    })
);

router.post(
    "/login",
    createRequestBodyValidator(validatorSchemas.body.authPostLoginBody),
    createAsyncController(async (request, response) => {
        const { email, password }: AuthPostLoginDTO = request.body;

        const user = await AuthService.getUserByEmail(email);
        if (!user) {
            return new UnauthorizedResponse<string>(
                ResponseMessages.EMAIL_AND_OR_PASSWORD_NOT_CORRECT,
                ResponseMessages.EMAIL_AND_OR_PASSWORD_NOT_CORRECT
            ).send(response);
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            return new UnauthorizedResponse<string>(
                ResponseMessages.EMAIL_AND_OR_PASSWORD_NOT_CORRECT,
                ResponseMessages.EMAIL_AND_OR_PASSWORD_NOT_CORRECT
            ).send(response);
        }

        const token = await JWTService.generateToken<UserGetDTO>({ email: user.email });
        return new OKResponse<AuthTokenResponse>(ResponseMessages.USER_LOGGED_IN_SUCCESSFULLY, {
            token: String(token)
        }).send(response);
    })
);

router.get(
    "/me",
    verifyJWTMiddleware,
    createAsyncController(async (request, response) => {
        const user = await getUserFromRequest(request);
        if (!user) {
            return new UnauthorizedResponse<string>(
                ResponseMessages.USER_NOT_FOUND,
                ResponseMessages.USER_NOT_FOUND
            ).send(response);
        }

        return new OKResponse<UserGetDTO>(ResponseMessages.OK, { email: user.email }).send(response);
    })
);

router.get(
    "/refresh",
    verifyJWTMiddleware,
    createAsyncController(async (request, response) => {
        const user = await getUserFromRequest(request);
        if (!user) {
            return new UnauthorizedResponse<string>(
                ResponseMessages.USER_NOT_FOUND,
                ResponseMessages.USER_NOT_FOUND
            ).send(response);
        }

        const token = await JWTService.generateToken<UserGetDTO>({ email: user.email });
        return new OKResponse<AuthTokenResponse>(ResponseMessages.OK, { token: String(token) }).send(response);
    })
);

export default router;

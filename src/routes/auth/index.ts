import { Router } from "express";
import bcrypt from "bcrypt";
//
import { createRequestBodyValidator } from "utils/api/middlewares/createRequestBodyValidator";
import createAsyncController from "utils/api/middlewares/createAsyncController";
import { UserCreationAttributes } from "db/models/user";
import AuthService from "services/db/auth";
import {
    BadRequestResponse,
    CreatedResponse,
    NotFoundResponse,
    OKResponse,
    UnauthorizedResponse
} from "utils/api/response";
import validatorSchemas from "utils/api/validator/schemes";
import { AuthPostLoginDTO, AuthPostRegisterDTO, UserGetDTO } from "dto/auth";
import JWTService from "services/jwt";
import verifyJWTMiddleware from "middlewares/verifyJWTMiddleware";
import getJWTTokenFromRequest from "../../utils/helpers/getJWTTokenFromRequest";

const router = Router();

router.post(
    "/register",
    createRequestBodyValidator(validatorSchemas.body.authPostRegisterBody),
    createAsyncController(async (req, res) => {
        const { email, password, passwordAgain }: AuthPostRegisterDTO = req.body;

        if (password !== passwordAgain) {
            return new BadRequestResponse<string>("Passwords do not match!", "Passwords do not match!").send(res);
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const userCreationAttributes: UserCreationAttributes = {
            email,
            passwordHash
        };

        const user = await AuthService.createUser(userCreationAttributes);

        const token = await JWTService.generateToken<UserGetDTO>({ email: user.email });
        return new CreatedResponse<{ token: string }>("User created successfully.", { token: String(token) }).send(res);
    })
);

router.post(
    "/login",
    createRequestBodyValidator(validatorSchemas.body.authPostLoginBody),
    createAsyncController(async (req, res) => {
        const simpleErrorMessage = "Email and/or password not correct.";

        const { email, password }: AuthPostLoginDTO = req.body;

        const user = await AuthService.getUserByEmail(email);
        if (!user) {
            return new UnauthorizedResponse<string>(simpleErrorMessage, simpleErrorMessage).send(res);
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            return new UnauthorizedResponse<string>(simpleErrorMessage, simpleErrorMessage).send(res);
        }

        const token = await JWTService.generateToken<UserGetDTO>({ email: user.email });
        return new OKResponse<{ token: string }>("User logged in successfully.", { token: String(token) }).send(res);
    })
);

router.get(
    "/me",
    verifyJWTMiddleware,
    createAsyncController(async (req, res) => {
        const user = await AuthService.getUserFromExpressRequest(req);
        if (!user) {
            return new UnauthorizedResponse<string>("User not found.", "User not found.").send(res);
        }

        return new OKResponse<UserGetDTO>("OK.", { email: user.email }).send(res);
    })
);

router.get(
    "/refresh",
    verifyJWTMiddleware,
    createAsyncController(async (req, res) => {
        const currentTokenString = getJWTTokenFromRequest(req);
        const currentToken = (await JWTService.verifyToken(currentTokenString)) as { email: string };

        const user = await AuthService.getUserByEmail(currentToken?.email || "");
        if (!user) {
            return new UnauthorizedResponse<string>("User not found.", "User not found.").send(res);
        }

        const token = await JWTService.generateToken<UserGetDTO>({ email: user.email });
        return new OKResponse<{ token: string }>("OK.", { token: String(token) }).send(res);
    })
);

export default router;

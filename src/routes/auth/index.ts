import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//
import { createRequestBodyValidator } from "utils/api/middlewares/createRequestBodyValidator";
import createAsyncController from "utils/api/middlewares/createAsyncController";
import User, { UserCreationAttributes } from "db/models/user";
import authService from "services/db/auth";
import { BadRequestResponse, CreatedResponse } from "utils/api/response";
import validatorSchemas from "utils/api/validator/schemes";
import { UserCreateDTO, UserGetDTO } from "dto/auth";
import JWTService from "../../services/jwt";

const router = Router();

router.post(
    "/register",
    createRequestBodyValidator(validatorSchemas.body.authPostRegisterBody),
    createAsyncController(async (req, res) => {
        const { email, password, passwordAgain }: UserCreateDTO = req.body;

        if (password !== passwordAgain) {
            return new BadRequestResponse<string>("Passwords do not match!", "Passwords do not match!").send(res);
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const userCreationAttributes: UserCreationAttributes = {
            email,
            passwordHash
        };

        const user = await authService.createUser(userCreationAttributes);

        const token = await JWTService.generateToken<UserGetDTO>({ email: user.email });

        return new CreatedResponse<{ token: string }>("User created successfully.", { token: String(token) }).send(res);
    })
);

export default router;

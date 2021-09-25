import { Router } from "express";
import { createRequestBodyValidator } from "utils/api/middlewares/createRequestBodyValidator";
import createAsyncController from "utils/api/middlewares/createAsyncController";
import validatorSchemas from "utils/api/validator/schemes";
import { CreatedResponse, UnauthorizedResponse } from "utils/api/response";
import { ShopPostDTO } from "dto/shop";
import verifyJWTMiddleware from "middlewares/verifyJWTMiddleware";
import getJWTTokenFromRequest from "utils/helpers/getJWTTokenFromRequest";
import JWTService from "services/jwt";
import AuthService from "services/db/auth";
import ShopService from "../../services/db/shop";
import Shop from "../../db/models/shop";

const router = Router();

router.post(
    "/",
    verifyJWTMiddleware,
    createRequestBodyValidator(validatorSchemas.body.shopPostBody),
    createAsyncController(async (req, res) => {
        const user = await AuthService.getUserFromExpressRequest(req);
        if (!user) {
            return new UnauthorizedResponse<string>("User not found.", "User not found.").send(res);
        }

        const { name }: ShopPostDTO = req.body;

        //DTO
        const shop = await ShopService.createShop({ name, userId: user.id });
        return new CreatedResponse<Shop>("Shop created successfully.", shop).send(res);
    })
);

router.get(
    "/",
    verifyJWTMiddleware,
    createAsyncController(async (req, res) => {
        const user = await AuthService.getUserFromExpressRequest(req);
        if (!user) {
            return new UnauthorizedResponse<string>("User not found.", "User not found.").send(res);
        }

        //DTO
        const shops = await ShopService.getShopsByUserId(user.id);
        return new CreatedResponse<Shop[]>("Shops found successfully.", shops).send(res);
    })
);

export default router;

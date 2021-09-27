import { Router } from "express";
//
import { createRequestBodyValidator } from "utils/api/middlewares/createRequestBodyValidator";
import createAsyncController from "utils/api/middlewares/createAsyncController";
import validatorSchemas from "utils/api/validator/schemes";
import { CreatedResponse, UnauthorizedResponse } from "utils/api/response";
import { ShopPostDTO } from "dto/shop";
import verifyJWTMiddleware from "middlewares/verifyJWTMiddleware";
import ShopService from "services/db/shop";
import Shop from "db/models/shop";
import getUserFromRequest from "utils/helpers/getUserFromRequest";
import ResponseMessages from "utils/helpers/responseMessages";

const router = Router();

router.post(
    "/",
    verifyJWTMiddleware,
    createRequestBodyValidator(validatorSchemas.body.shopPostBody),
    createAsyncController(async (request, response) => {
        const user = await getUserFromRequest(request);
        if (!user) {
            return new UnauthorizedResponse<string>(
                ResponseMessages.USER_NOT_FOUND,
                ResponseMessages.USER_NOT_FOUND
            ).send(response);
        }

        const { name }: ShopPostDTO = request.body;

        //DTO
        const shop = await ShopService.createShop({ name, userId: user.id });
        return new CreatedResponse<Shop>(ResponseMessages.SHOP_CREATED_SUCCESSFULLY, shop).send(response);
    })
);

router.get(
    "/",
    verifyJWTMiddleware,
    createAsyncController(async (request, response) => {
        const user = await getUserFromRequest(request);
        if (!user) {
            return new UnauthorizedResponse<string>(
                ResponseMessages.USER_NOT_FOUND,
                ResponseMessages.USER_NOT_FOUND
            ).send(response);
        }

        //DTO
        const shops = await ShopService.getShopsByUserId(user.id);
        return new CreatedResponse<Shop[]>(ResponseMessages.SHOPS_FOUND_SUCCESSFULLY, shops).send(response);
    })
);

export default router;

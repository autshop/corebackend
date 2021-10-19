import { Router } from "express";
//
import { createRequestBodyValidator } from "middlewares/createRequestBodyValidator";
import createAsyncController from "middlewares/createAsyncController";
import validatorSchemas from "utils/api/validator/schemes";
import { CreatedResponse, NotFoundResponse, UnauthorizedResponse } from "utils/api/response";
import { ShopGetDTO, ShopPostDTO, ShopsGetDTO } from "dto/shop";
import verifyJWTMiddleware from "middlewares/verifyJWTMiddleware";
import ShopService from "services/db/shop";
import getUserFromRequest from "utils/helpers/getUserFromRequest";
import ResponseMessages from "utils/helpers/responseMessages";
import { transformShopModelsToShopDTOs, transformShopModelToShopDTO } from "dto/shop/transformers";
import ShopHandlerService from "services/shopHandlerService";
import Shop from "db/models/shop";

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

        const shop = await ShopService.createShop({ name, userId: user.id });

        //This is an async job on what we are intentionally not waiting for.
        ShopHandlerService.createShop(shop.id).then();

        const shopDTO: ShopGetDTO = transformShopModelToShopDTO(shop);
        return new CreatedResponse<ShopGetDTO>(ResponseMessages.SHOP_CREATED_SUCCESSFULLY, shopDTO).send(response);
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

        const shops = (await ShopService.getShopsByUserId(user.id)) || [];
        const shopsGetDTO: ShopsGetDTO = transformShopModelsToShopDTOs(shops);
        return new CreatedResponse<ShopsGetDTO>(ResponseMessages.SHOPS_FOUND_SUCCESSFULLY, shopsGetDTO).send(response);
    })
);

router.get(
    "/:id",
    verifyJWTMiddleware,
    createAsyncController(async (request, response) => {
        const user = await getUserFromRequest(request);
        if (!user) {
            return new UnauthorizedResponse<string>(
                ResponseMessages.USER_NOT_FOUND,
                ResponseMessages.USER_NOT_FOUND
            ).send(response);
        }

        const {
            params: { id }
        } = request;
        const shopId = Number(id);

        const shop: Shop | null = await ShopService.getShopById(shopId);
        if (!shop) {
            return new NotFoundResponse<string>(ResponseMessages.SHOP_NOT_FOUND, ResponseMessages.SHOP_NOT_FOUND).send(
                response
            );
        }

        const shopGetDTO: ShopGetDTO = transformShopModelToShopDTO(shop);
        return new CreatedResponse<ShopGetDTO>(ResponseMessages.SHOP_FOUND_SUCCESSFULLY, shopGetDTO).send(response);
    })
);

export default router;

import { map } from "lodash";
//
import Shop from "db/models/shop";
import { ShopGetDTO, ShopsGetDTO } from "dto/shop";

export const transformShopModelToShopDTO = (shop: Shop): ShopGetDTO => ({
    id: shop.id,
    name: shop.name
});

export const transformShopModelsToShopDTOs = (shops: Shop[]): ShopsGetDTO =>
    map(shops, shop => transformShopModelToShopDTO(shop));

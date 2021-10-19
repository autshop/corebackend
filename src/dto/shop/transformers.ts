import { map } from "lodash";
//
import Shop from "db/models/shop";
import { ShopGetDTO, ShopsGetDTO } from "dto/shop";

export const transformShopModelToShopDTO = ({ id, name, status }: Shop): ShopGetDTO => ({
    id,
    name,
    status
});

export const transformShopModelsToShopDTOs = (shops: Shop[]): ShopsGetDTO =>
    map(shops, shop => transformShopModelToShopDTO(shop));

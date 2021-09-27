import Shop, { ShopCreationAttributes } from "db/models/shop";

class ShopService {
    public static getShopById = async (shopId: number) => {
        return await Shop.findOne({
            where: { id: shopId }
        });
    };

    public static getShopsByUserId = async (userId: number) => {
        return await Shop.findAll({
            where: { userId }
        });
    };

    public static createShop = async (shopCreationAttributes: ShopCreationAttributes) => {
        return await Shop.create(shopCreationAttributes);
    };
}

export default ShopService;

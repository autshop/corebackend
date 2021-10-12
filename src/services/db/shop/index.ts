import Shop, { ShopCreationAttributes, ShopStatus } from "db/models/shop";

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

    public static updateShopStatus = async (shopId: number, shopStatus: ShopStatus) => {
        const shop: Shop | null = await ShopService.getShopById(shopId);

        if (!shop) {
            throw new Error("Shop not found.");
        }

        shop.status = shopStatus;
        await shop.save();
    };
}

export default ShopService;

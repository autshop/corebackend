import Shop, { ShopCreationAttributes } from "db/models/shop";

const getShopById = async (shopId: number) => {
    return await Shop.findOne({
        where: { id: shopId }
    });
};

const getShopsByUserId = async (userId: number) => {
    return await Shop.findAll({
        where: { userId }
    });
};

const createShop = async (shopCreationAttributes: ShopCreationAttributes) => {
    return await Shop.create(shopCreationAttributes);
};

const ShopService = {
    getShopById,
    createShop,
    getShopsByUserId
};

export default ShopService;

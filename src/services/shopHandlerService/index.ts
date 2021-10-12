import ShopService from "services/db/shop";
import ElephantSQLService from "services/elephantSQL";
import { DBConfig } from "services/elephantSQL/util";
import CloudformationService from "services/aws/cloudformation";
import Shop from "db/models/shop";

class ShopHandlerService {
    public static async createShop(shopId: number) {
        return new Promise<void>(async (resolve, reject) => {
            const shop: Shop | null = await ShopService.getShopById(shopId);

            if (!shop) {
                return reject("Internal error: No shop found with id.");
            }

            const dbConfig: DBConfig = await ElephantSQLService.postInstance(shop.name);

            await CloudformationService.createShop(shop.id, shop.name, dbConfig);

            resolve();
        });
    }
}

export default ShopHandlerService;

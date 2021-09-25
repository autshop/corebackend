import { Sequelize } from "sequelize";
//
import { getDatabaseURL } from "db/config";
import User, { initialize as initializeUserModel } from "db/models/user";
import Shop, { initialize as initializeShopModel } from "db/models/shop";

const sequelize = new Sequelize(getDatabaseURL());

const initializeModels = async (forceSync: boolean) => {
    initializeUserModel(sequelize);
    await User.sync({ force: forceSync });

    initializeShopModel(sequelize);
    await Shop.sync({ force: forceSync });
};

(async () => {
    //TODO migrations

    const seed = process.env.SEED_DB === "true";
    await initializeModels(seed);
    if (seed) {
        //await seedDatabase();
    }
})();

export default sequelize;

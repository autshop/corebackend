import { Model, DataTypes, Optional, Sequelize } from "sequelize";
import User from "./user";
//

interface ShopAttributes {
    id: number;
    name: string;
    userId: number;
}

export interface ShopCreationAttributes extends Optional<ShopAttributes, "id"> {}

class Shop extends Model<ShopAttributes, ShopCreationAttributes> implements ShopAttributes {
    public id!: number;
    public name!: string;
    public userId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initialize = (sequelize: Sequelize) => {
    Shop.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: new DataTypes.STRING(128)
            },
            userId: {
                type: DataTypes.INTEGER.UNSIGNED
            }
        },
        {
            tableName: "shop",
            sequelize: sequelize
        }
    );

    User.hasMany(Shop, {
        foreignKey: "userId",
        as: "shops"
    });
    Shop.belongsTo(User, { foreignKey: "userId" });
};

export default Shop;

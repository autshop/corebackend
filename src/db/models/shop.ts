import { Model, DataTypes, Optional, Sequelize } from "sequelize";
//
import User from "db/models/user";

interface ShopAttributes {
    id: number;
    name: string;
    userId: number;
    status: string;
}

export enum ShopStatus {
    INITIAL = "INITIAL",
    CREATE_COMPLETE = "CREATE_COMPLETE",
    CREATE_IN_PROGRESS = "CREATE_IN_PROGRESS",
    ERROR = "ERROR"
}

export interface ShopCreationAttributes extends Optional<ShopAttributes, "id" | "status"> {}

class Shop extends Model<ShopAttributes, ShopCreationAttributes> implements ShopAttributes {
    public id!: number;
    public name!: string;
    public userId!: number;
    public status!: string;

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
            },
            status: {
                type: DataTypes.ENUM(ShopStatus.CREATE_IN_PROGRESS, ShopStatus.CREATE_COMPLETE),
                defaultValue: ShopStatus.INITIAL
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

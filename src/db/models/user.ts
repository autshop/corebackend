import { DataTypes, Model, Sequelize, Optional } from "sequelize";

interface UserAttributes {
    id: number;
    email: string;
    passwordHash: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public passwordHash!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initialize = (sequelize: Sequelize) => {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true
            },
            email: {
                type: new DataTypes.STRING(128),
                allowNull: true
            },
            passwordHash: {
                type: new DataTypes.STRING(256),
                allowNull: true
            }
        },
        {
            tableName: "user",
            sequelize: sequelize
        }
    );
};

export default User;

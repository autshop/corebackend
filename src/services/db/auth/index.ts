import User, { UserCreationAttributes } from "db/models/user";

const getUserById = async (userId: number) => {
    return await User.findOne({
        where: { id: userId }
    });
};

const getUserByEmail = async (email: string) => {
    return await User.findOne({
        where: { email }
    });
};

const createUser = async (userCreationAttributes: UserCreationAttributes) => {
    return await User.create(userCreationAttributes);
};

const authService = {
    getUserById,
    createUser,
    getUserByEmail
};

export default authService;

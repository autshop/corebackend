import User, { UserCreationAttributes } from "db/models/user";

const getUser = async (userId: number) => {
    return await User.findOne({
        where: { id: userId }
    });
};

const createUser = async (userCreationAttributes: UserCreationAttributes) => {
    return await User.create(userCreationAttributes);
};

const authService = {
    getUser,
    createUser
};

export default authService;

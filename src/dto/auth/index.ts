export type UserCreateDTO = {
    email: string;
    password: string;
    passwordAgain: string;
};

export type UserGetDTO = {
    email: string;
};

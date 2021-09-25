export type AuthPostRegisterDTO = {
    email: string;
    password: string;
    passwordAgain: string;
};

export type AuthPostLoginDTO = {
    email: string;
    password: string;
};

export type UserGetDTO = {
    email: string;
};

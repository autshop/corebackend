import { Request } from "express";

const getJWTTokenFromRequest = (request: Request) => {
    const authorizationHeader = request.headers.authorization || "";
    return authorizationHeader.split(" ")[1];
};

export default getJWTTokenFromRequest;

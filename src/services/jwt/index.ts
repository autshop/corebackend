import jwt from "jsonwebtoken";

const secret = String(process.env.JWT_SECRET);

const signPromise = <T extends Object>(data: T) =>
    new Promise((resolve, reject) => {
        jwt.sign(data, secret, (err, token) => {
            if (err) {
                return reject(err);
            }
            return resolve(token);
        });
    });

const verifyPromise = (token: string) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, token) => {
            if (err) {
                return reject(err);
            }
            return resolve(token);
        });
    });

export default class JWTService {
    public static async generateToken<T>(data: T) {
        return await signPromise<T>(data);
    }
    public static async verifyToken(token: string) {
        return await verifyPromise(token);
    }
}

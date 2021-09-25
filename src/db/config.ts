const DBAuthenticationConfig = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT
};

export const getDatabaseURL = (): string =>
    `postgres://${DBAuthenticationConfig.username}:${DBAuthenticationConfig.password}@${DBAuthenticationConfig.server}:${DBAuthenticationConfig.port}/${DBAuthenticationConfig.name}`;

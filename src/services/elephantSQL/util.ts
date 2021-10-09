import { get } from "lodash";

export type DBConfig = {
    username: string;
    password: string;
    server: string;
    databaseName: string;
};

export const transformConnectionStringToDBParams = (connectionString: string): DBConfig => {
    const urlWithoutProtocol = get(connectionString.split("://"), "[1]", "");
    const userNameAndPassword = get(urlWithoutProtocol.split("@"), "[0]", "");
    const serverAndDatabaseName = get(urlWithoutProtocol.split("@"), "[1]", "");

    return {
        username: get(userNameAndPassword.split(":"), "[0]", ""),
        password: get(userNameAndPassword.split(":"), "[1]", ""),
        server: get(serverAndDatabaseName.split("/"), "[0]", ""),
        databaseName: get(serverAndDatabaseName.split("/"), "[1]", "")
    };
};

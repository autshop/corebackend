import axios, { AxiosResponse } from "axios";
//
import { GetInstanceResponse, PostInstanceRequestBody, PostInstanceResponse } from "services/elephantSQL/types";
import { DBConfig, transformConnectionStringToDBParams } from "services/elephantSQL/util";

class ElephantSQLService {
    private static baseURL: string = "https://customer.elephantsql.com/api/";

    private static getBasicAuthenticationConfig() {
        return {
            auth: {
                username: "",
                password: String(process.env.ELEPHANTSQL_API_KEY)
            }
        };
    }

    public static async postInstance(name: string): Promise<DBConfig> {
        const postInstanceRequestBody: PostInstanceRequestBody = {
            name,
            plan: "turtle",
            region: "amazon-web-services::eu-west-1"
        };

        const { data }: AxiosResponse<PostInstanceResponse> = await axios.post(
            `${ElephantSQLService.baseURL}/instances`,
            postInstanceRequestBody,
            {
                ...ElephantSQLService.getBasicAuthenticationConfig()
            }
        );

        return transformConnectionStringToDBParams(data.url);
    }

    public static async getInstance(id: number): Promise<DBConfig> {
        const { data }: AxiosResponse<GetInstanceResponse> = await axios.get(
            `${ElephantSQLService.baseURL}/instances/${id}`,
            {
                ...ElephantSQLService.getBasicAuthenticationConfig()
            }
        );

        return transformConnectionStringToDBParams(data.url);
    }
}

export default ElephantSQLService;

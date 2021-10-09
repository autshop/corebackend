export type PostInstanceRequestBody = {
    name: string;
    plan: string;
    region: string;
};

export type PostInstanceResponse = {
    id: number;
    message: string;
    apiKey: string;
    url: string;
};

export type GetInstanceResponse = {
    id: number;
    plan: string;
    region: string;
    name: string;
    url: string;
    providerid: string;
    apikey: string;
    ready: boolean;
};

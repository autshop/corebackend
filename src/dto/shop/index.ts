export type ShopPostDTO = {
    name: string;
};

export type ShopGetDTO = {
    id: number;
    name: string;
    status: string;
};

export type ShopsGetDTO = ShopGetDTO[];

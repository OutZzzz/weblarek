import { IBuyer, IProductResponse, OrderResponse } from "../../types";
import { Api } from "../base/Api";

export class Queryes {
    private api: Api;

    constructor(api: Api) {
        this.api = api
    }

    async getQuery(): Promise<IProductResponse> {
        const data = await this.api.get<IProductResponse>('/product/');
        return data
    }

    async postQuery(order: IBuyer): Promise<OrderResponse> {
        return await this.api.post('/order/', order);
    }
}
import { IBuyer, IProductResponse, OrderResponse, IApi } from "../../types";

export class Queryes {

    constructor(private api: IApi) {
        this.api = api;
    }

    async getQuery(): Promise<IProductResponse> {
        return await this.api.get<IProductResponse>('/product/');
    }

    async postQuery(order: IBuyer): Promise<OrderResponse> {
        return await this.api.post('/order/', order);
    }
}
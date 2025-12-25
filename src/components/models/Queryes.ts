import { IProductResponse, OrderResponse, IApi, IOrder } from "../../types";

export class Queryes {

    constructor(private api: IApi) {
        this.api = api;
    }

    async getQuery(): Promise<IProductResponse> {
        return await this.api.get<IProductResponse>('/product/');
    }

    async postQuery(order: IOrder): Promise<OrderResponse> {
        return await this.api.post('/order/', order);
    }
}
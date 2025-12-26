import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Cart {
    cartItems: IProduct[] = [];

    constructor (private events: EventEmitter) {}

    addItem(item: IProduct): void {
        this.cartItems.push(item)
        this.events.emit('basket:changed', this.cartItems);
    }

    getCartItems(): IProduct[] {
        return this.cartItems
    }

    removeItem(item: IProduct): void {
        this.cartItems = this.cartItems.filter((elem) => elem !== item);
        this.events.emit('basket:changed', this.cartItems);
    }

    clearCart(): void {
        this.cartItems = [];
        this.events.emit('basket:changed', this.cartItems);
    }

    getAllPrices(): number {
        let price: number = 0;
        this.cartItems.forEach((item) => {
        if (item.price) {
            price += item.price
        }
       })
       return price;
    }

    checkItemExist(id: string): boolean {
       return this.cartItems.some((item) => item.id === id)
    }

    getCartCount(): number {
    return this.cartItems.length;
}
}
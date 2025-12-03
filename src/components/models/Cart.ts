import { IProduct } from "../../types";

export class Cart {
    cartItems: IProduct[];

    constructor (cartItems: IProduct[] = []) {
        this.cartItems = cartItems;
    }

    addItem(item: IProduct): void {
        this.cartItems.push(item)
    }

    getCartItems(): IProduct[] {
        return this.cartItems
    }

    removeItem(item: IProduct): void {
        this.cartItems = this.cartItems.filter((elem) => elem !== item);
    }

    clearCart(): void {
        this.cartItems = [];
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
}
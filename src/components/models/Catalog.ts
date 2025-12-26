import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Catalog {
    private catalogItems: IProduct[] = [];
    private itemData: IProduct | null = null;

    constructor(private events: EventEmitter) {}

    setCatalogItems(arr: IProduct[]): void {
        this.catalogItems = arr;
        this.events.emit('catalog:changed', this.catalogItems);
    }

    getCatalogItems(): IProduct[] {
        return this.catalogItems;
    }

    setItemData(item: IProduct): void {
        this.itemData = item;
        this.events.emit('card:select', this.catalogItems)
    }

    getItemData(): IProduct | null {
        return this.itemData;
    }

    getItembyID(id: string): IProduct | undefined {
        const item: IProduct | undefined = this.catalogItems.find((item) => item.id === id);
        return item
    }
}


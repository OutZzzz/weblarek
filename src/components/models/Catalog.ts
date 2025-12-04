import { IProduct } from "../../types";

export class Catalog {
    private catalogItems: IProduct[] = [];
    private itemData: IProduct | null = null;

    constructor() {}

    setCatalogItems(arr: IProduct[]): void {
        this.catalogItems = arr;
    }

    getCatalogItems(): IProduct[] {
        return this.catalogItems;
    }

    setItemData(item: IProduct): void {
        this.itemData = item;
    }

    getItemData(): IProduct | null {
        return this.itemData;
    }

    getItembyID(id: string): IProduct | undefined {
        const item: IProduct | undefined = this.catalogItems.find((item) => item.id === id);
        return item
    }
}


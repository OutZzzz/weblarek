import { IProduct } from "../../types";

export class Catalog {
    private catalogItems: IProduct[];
    private itemData: IProduct | null;

    constructor(catalogItems: IProduct[] = [], itemData: IProduct | null = null) {
        this.catalogItems = catalogItems;
        this.itemData = itemData;
    }

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

    getItembyID(id: string): IProduct {
        const item: IProduct =  this.catalogItems.find((item) => item.id === id) as IProduct;
        return item
    }
}


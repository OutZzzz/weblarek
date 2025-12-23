import { ensureElement } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";
import { Card } from "./Card";

type CategoryKey = keyof typeof categoryMap;
type TCardPreview = {
    category: string,
    image: string,
    title: string,
    price: number | null,
    description: string
}


export class CardPreview extends Card<TCardPreview> {
    protected buttonElement: HTMLButtonElement;
    protected textElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container) 

        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container)
        this.textElement = ensureElement<HTMLElement>('.card__text', this.container)
        this.categoryElement = ensureElement<HTMLElement>(
            '.card__category',
            this.container
        );

        this.imageElement = ensureElement<HTMLImageElement>(
            '.card__image',
            this.container
        );
    }

    set description(value: string) {
        this.textElement.textContent = String(value)
    }

    set category(value: string) {
            this.categoryElement.textContent = value;
    
            for (const key in categoryMap) {
                this.categoryElement.classList.toggle(
                    categoryMap[key as CategoryKey],
                    key === value
                );
            }
        }
    
    set image(value: string) {
        this.setImage(this.imageElement, value, this.title);
    }
}
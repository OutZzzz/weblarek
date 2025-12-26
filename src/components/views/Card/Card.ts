import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";


export abstract class Card<T> extends Component<T> {
    protected priceElement: HTMLElement;
    protected titleElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container)
        
        this.priceElement = ensureElement<HTMLElement>(
            '.card__price',
             this.container
        )
        
        this.titleElement = ensureElement<HTMLElement>(
            '.card__title', 
            this.container
        )
    }

    set price(value: number | null) {
        value === null ? this.priceElement.textContent = 'Бесценно' : this.priceElement.textContent = String(value)
    }

    set title(value: string) {
        this.titleElement.textContent = String(value)
    }
}
import { ICardActions, IProduct } from "../../types"
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";


type TBasket = {
    order: HTMLElement[];
    totalPrice: number
}

export class Basket extends Component<TBasket> {
    protected orderListElement: HTMLElement;
    protected totalPriceElement: HTMLElement;
    protected buttonElement: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.orderListElement = ensureElement<HTMLElement>(
            '.basket__list',
            this.container
        )
        this.totalPriceElement = ensureElement<HTMLElement>(
            '.basket__price', 
            this.container
        )
        this.buttonElement = ensureElement<HTMLElement>(
            '.basket__button',
            this.container
        )

        if (actions?.onClick) {
            this.buttonElement.addEventListener('click', actions.onClick)
        }
    }

    set order(value: HTMLElement[]) {
        this.orderListElement.append(...value)
    }

    set totalPrice(value: number) {
        this.totalPriceElement.textContent = String(value)
    }
}
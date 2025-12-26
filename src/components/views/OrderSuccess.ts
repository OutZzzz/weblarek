import { ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

type TOrderSuccess = {
    description: string;
}

export class OrderSuccess extends Component<TOrderSuccess> {
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.descriptionElement = ensureElement<HTMLElement>(
            '.order-success__description',
            this.container
        )

        this.buttonElement = ensureElement<HTMLElement>(
            '.order-success__close',
            this.container
        )

        if (actions?.onClick) {
            this.buttonElement.addEventListener('click', actions.onClick);
        }
    }

    set description(value: string){
        this.descriptionElement.textContent = value
    }
}
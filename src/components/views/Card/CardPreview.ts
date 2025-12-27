import { ensureElement } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";
import { Card } from "./Card";
import { ICardActions, IProduct } from "../../../types";


type CategoryKey = keyof typeof categoryMap;

type TCardPreview = Omit<IProduct, 'id'> & { 
    button: {
        text: string; 
        disabled: boolean
    } 
}

export class CardPreview extends Card<TCardPreview> {
    private buttonElement: HTMLButtonElement;
    private textElement: HTMLElement;
    private imageElement: HTMLImageElement;
    private categoryElement: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container) 

        this.buttonElement = ensureElement<HTMLButtonElement>(
            '.card__button',
            this.container
        )
        this.textElement = ensureElement<HTMLElement>(
            '.card__text',
            this.container
        )
        this.categoryElement = ensureElement<HTMLElement>(
            '.card__category',
            this.container
        )

        this.imageElement = ensureElement<HTMLImageElement>(
            '.card__image',
            this.container
        )

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
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
        this.setImage(this.imageElement, value);
    }

    set button(value: {text: string; disabled: boolean}) {
        this.buttonElement.textContent = value.text;
        this.buttonElement.disabled = value.disabled;
    }
}
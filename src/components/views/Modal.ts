import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IModal {
    content: HTMLElement
}


export class Modal extends Component<IModal> {
    protected contentElement: HTMLElement;
    protected modalButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container)

        this.contentElement = ensureElement<HTMLElement>(
            '.modal__content',
             this.container
        );
        this.modalButton = ensureElement<HTMLButtonElement>(
            '.modal__close', 
            this.container
        );

        this.modalButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        });

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.events.emit('modal:close')
            }
        })
    }

    open(): void {
        this.container.classList.add('modal_active')
    }

    close(): void {
        this.container.classList.remove('modal_active')
    }

    set content(data: HTMLElement) {
        this.contentElement.replaceChildren(data)
    }
}
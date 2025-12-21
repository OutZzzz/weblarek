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
    }

    set content(data: HTMLTemplateElement) {
        this.contentElement.replaceChildren(data)
    }
}
import { IBuyer, TFormValidate } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";


type FormContactsType = Omit<IBuyer, 'payment' | 'address'> & TFormValidate;

interface IFormActions {
    onSubmit?: () => void;
    onEmailChange?: (value: string) => void;
    onPhoneChange?: (value: string) => void;
}

export class FormContacts extends Component<FormContactsType> {
    protected emailInputElement: HTMLInputElement;
    protected phoneInputElement: HTMLInputElement;
    protected submitButtonElement: HTMLButtonElement;
    protected formErorrsElement: HTMLElement;

    constructor(container: HTMLElement, actions?: IFormActions){
        super(container);

        this.emailInputElement = ensureElement<HTMLInputElement>(
            'input[name="email"]',
            this.container
        )

        this.phoneInputElement = ensureElement<HTMLInputElement>(
            'input[name="phone"]',
            this.container
        )

        this.submitButtonElement = ensureElement<HTMLButtonElement>(
            '.button',
            this.container
        )

        this.formErorrsElement = ensureElement<HTMLElement>(
            '.form__errors',
            this.container
        )

        if (actions?.onSubmit) {
            this.container.addEventListener('submit', (form) => {
                form.preventDefault()
                actions.onSubmit!()
            })
        }

        if (actions?.onEmailChange) {
            this.emailInputElement.addEventListener('input', () => {
                actions.onEmailChange!(this.emailInputElement.value)
            })
        }

        if (actions?.onPhoneChange) {
            this.phoneInputElement.addEventListener('input', () => {
                actions.onPhoneChange!(this.phoneInputElement.value)
            })
        }
    }

    set email(value: string) {
        this.emailInputElement.value = value
    }

    set phone(value: string) {
        this.phoneInputElement.value = value
    }

    set valid(value: boolean) {
        this.submitButtonElement.disabled = !value
    }

    set error(value: string) {
        this.formErorrsElement.textContent = value
    }
}
import { IBuyer, TFormValidate } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { BaseForm } from "./Form";


type TFormContactsType = Omit<IBuyer, 'payment' | 'address'> & TFormValidate;

interface IFormActions {
    onSubmit: () => void;
    onEmailChange?: (value: string) => void;
    onPhoneChange?: (value: string) => void;
}

export class FormContacts extends BaseForm<TFormContactsType> {
    private emailInputElement: HTMLInputElement;
    private phoneInputElement: HTMLInputElement;
    private actions: IFormActions;

    constructor(container: HTMLElement, actions: IFormActions){
        super(container);

        this.actions = actions;

        this.emailInputElement = ensureElement<HTMLInputElement>(
            'input[name="email"]',
            this.container
        )

        this.phoneInputElement = ensureElement<HTMLInputElement>(
            'input[name="phone"]',
            this.container
        )

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

    protected onSubmit() {
        this.actions.onSubmit();
    }

    set email(value: string) {
        this.emailInputElement.value = value
    }

    set phone(value: string) {
        this.phoneInputElement.value = value
    }
}
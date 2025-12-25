import { IBuyer, TFormValidate, TPayment } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";


type FormOrderType = Omit<IBuyer, 'phone' | 'email'> & TFormValidate;

interface IFormActions {
    onSubmit?: () => void;
    onPaymentChange?: (method: TPayment) => void;
    onAddressChange?: (value: string) => void;
}

export class FormOrder extends Component<FormOrderType> {
    protected paymentButtonElement: HTMLButtonElement[];
    protected addressInputElement: HTMLInputElement;
    protected orderButtonElement: HTMLButtonElement;
    protected formErorrsElement: HTMLElement;

    constructor(container: HTMLElement, actions?: IFormActions) {
        super(container)

        this.paymentButtonElement = Array.from(
            this.container.querySelectorAll<HTMLButtonElement>(
                '.order__buttons button'
            )
        )

        this.orderButtonElement = ensureElement<HTMLButtonElement>(
            '.order__button', 
            this.container
        )

        this.formErorrsElement = ensureElement<HTMLElement>(
            '.form__errors', 
            this.container
        )

        this.addressInputElement = ensureElement<HTMLInputElement>(
            'input[name="address"]',
            this.container
        )

        if (actions?.onSubmit) {
            this.container.addEventListener('submit', (form) => {
                form.preventDefault()
                actions.onSubmit!()
            })
        }

        if (actions?.onPaymentChange) {
            this.paymentButtonElement.forEach((button) => {
                button.addEventListener('click', () => {
                    actions.onPaymentChange!(button.name as TPayment)
                })
            })
        }

        if (actions?.onAddressChange) {
            this.addressInputElement.addEventListener('input', () => {
                actions.onAddressChange!(this.addressInputElement.value)
            })
        }
    }

    set payment(value: TPayment) {
        this.paymentButtonElement.forEach((button) => {
            button.classList.toggle(
                'button_alt-active',
                button.name === value
            )
        })
    }

    set address(value: string){
        this.addressInputElement.value = value
    }

    set error(value: string) {
        this.formErorrsElement.textContent = value
    }

    set valid(value: boolean) {
        this.orderButtonElement.disabled = !value
    }

}
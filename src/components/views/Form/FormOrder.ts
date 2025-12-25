import { IBuyer, TFormValidate, TPayment } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { BaseForm } from "./Form";


type TFormOrderType = Omit<IBuyer, 'phone' | 'email'> & TFormValidate;

interface IFormActions {
    onSubmit?: () => void;
    onPaymentChange?: (method: TPayment) => void;
    onAddressChange?: (value: string) => void;
}

export class FormOrder extends BaseForm<TFormOrderType> {
    protected paymentButtonElement: HTMLButtonElement[];
    protected addressInputElement: HTMLInputElement;
    protected actions: IFormActions;

    constructor(container: HTMLElement, actions: IFormActions) {
        super(container)

        this.actions = actions;

        this.paymentButtonElement = Array.from(
            this.container.querySelectorAll<HTMLButtonElement>(
                '.order__buttons button'
            )
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

    protected onSubmit() {
        this.actions.onSubmit!();
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

}
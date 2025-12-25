import { IBuyer, TPayment, ValidationErrors } from "../../types";

export class BuyerData {
    private payment: TPayment = null;
    private address: string = '';
    private phone: string = '';
    private email: string = '';
    
    constructor() {}

    savePayment(data: TPayment): void {
        this.payment = data
    }

    saveAddress(data: string): void {
        this.address = data
    }

    savePhone(data: string): void {
        this.phone = data
    }

    saveEmail(data: string): void {
        this.email = data
    }

    getAllData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email
        }
    }

    clearData(): void {
        this.payment = null;
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    validateData(fields: (keyof IBuyer)[]): ValidationErrors {
        const errors: ValidationErrors = {};
        if (fields.includes('payment') && this.payment === null) {
            errors.payment = 'Выберите способ оплаты'
        }
        if (fields.includes('address') && this.address === '') {
            errors.address = 'Введите адрес'
        }
        if (fields.includes('phone') && this.phone === '') {
            errors.phone = 'Введите телефон'
        }
        if (fields.includes('email') && this.email === '') {
            errors.email = 'Введите email'
        }
        return errors
    }
}
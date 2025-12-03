import { IBuyer, TPayment, ValidationErrors } from "../../types";

export class BuyerData {
    private payment: TPayment;
    private address: string;
    private phone: string;
    private email: string;
    
    constructor(
        payment: TPayment = '',
        address: string = '',
        phone: string = '',
        email: string = ''
    ) {
        this.payment = payment;
        this.address = address;
        this.phone = phone;
        this.email = email;
    }

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
        this.payment = '';
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    validateData(): ValidationErrors {
        const errors: ValidationErrors = {};
        if (this.payment === '') {
            errors.payment = 'Выберите способ оплаты'
        }
        if (this.address === '') {
            errors.address = 'Введите адрес'
        }
        if (this.phone === '') {
            errors.phone = 'Введите телефон'
        }
        if (this.email === '') {
            errors.email = 'Введите email'
        }
        return errors
    }
}
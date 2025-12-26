import { IBuyer, TPayment, ValidationErrors } from "../../types";
import { EventEmitter } from "../base/Events";

export class BuyerData {
    private payment: TPayment = null;
    private address: string = '';
    private phone: string = '';
    private email: string = '';
    
    constructor(private events: EventEmitter) {}

    savePayment(data: TPayment): void {
        this.payment = data
        this.events.emit('buyer:changed', this.getAllData());
    }

    saveAddress(data: string): void {
        this.address = data
        this.events.emit('buyer:changed', this.getAllData());
    }

    savePhone(data: string): void {
        this.phone = data
        this.events.emit('buyer:changed', this.getAllData());
    }

    saveEmail(data: string): void {
        this.email = data
        this.events.emit('buyer:changed', this.getAllData());
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
        this.events.emit('buyer:changed', this.getAllData());
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
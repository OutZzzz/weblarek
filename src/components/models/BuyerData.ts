import { IBuyer, TPayment } from "../../types";


export class BuyerData {
    private payment: TPayment | null;
    private address: string | null;
    private phone: string | null;
    private email: string | null;
    
    constructor(
        payment: TPayment | null = null,
        address: string | null = null,
        phone: string | null = null,
        email: string | null = null
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
        this.payment = null;
        this.address = null;
        this.phone = null;
        this.email = null;
    }

}
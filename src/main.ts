import { Api } from './components/base/Api';
import { BuyerData } from './components/models/BuyerData';
import { Cart } from './components/models/Cart';
import { Catalog } from './components/models/Catalog';
import { Queryes } from './components/models/Queryes';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { CardCatalog } from './components/views/Card/CardCatalog';
import { cloneTemplate } from './utils/utils';
import { Header } from './components/views/Header';
import { EventEmitter } from './components/base/Events';
import { Modal } from './components/views/Modal';
import { Gallery } from './components/views/Gallery';
import { CardPreview } from './components/views/Card/CardPreview';
import { CardBasket } from './components/views/Card/CardBasket';
import { Basket } from './components/views/Basket';
import { IOrder, IProduct, ValidationErrors } from './types';
import { FormOrder } from './components/views/Form/FormOrder';
import { FormContacts } from './components/views/Form/FormContacts';
import { OrderSuccess } from './components/views/Form/OrderSuccess';


// Модели данных

const productModel = new Catalog();
const productCart = new Cart();
const buyer = new BuyerData();

// Данные с сервера

const api = new Api(API_URL)
const serverData = new Queryes(api)

serverData.getQuery()
    .then(data => {
        data.items.forEach((item) => {
            item.image = CDN_URL + item.image
        })
        productModel.setCatalogItems(data.items);
        const itemCards = productModel.getCatalogItems().map((item) => {
            const card = new CardCatalog(
                cloneTemplate(
                    document.getElementById('card-catalog') as HTMLTemplateElement
                ), {
                    onClick: () => events.emit('card:select', item),
                });
            return card.render(item);
        })
        gallery.render({ catalog: itemCards });
        })
    .catch(error => console.error('Произошла ошибка: ', error))

//Контейнеры для отображения

const galleryContainer = document.querySelector('.gallery')
const modalContainer = document.getElementById('modal-container')
const containerHeader = document.querySelector('.header__container')

// Объекты

const events = new EventEmitter()
const gallery = new Gallery(galleryContainer as HTMLElement)
const header = new Header(events, containerHeader as HTMLElement)
const modal = new Modal(events, modalContainer as HTMLElement)

// Функции

function generatePreview(item: IProduct) {
    const itemExist = productCart.checkItemExist(item.id);

    const preview = new CardPreview(
        cloneTemplate(
            document.getElementById('card-preview') as HTMLTemplateElement
        ), { onClick: () => events.emit(itemExist ? 'card:remove' : 'basket:add', item) }
    );

    modal.render({
        content: preview.render({button: itemExist ? 'Удалить из корзины' : ' Купить', ...item})
    })

    modalContainer?.classList.add('modal_active')
}

function generateBasket() {

    const orderCards = productCart.getCartItems().map((item, index) => {
        const basketCard = new CardBasket(
            cloneTemplate(document.getElementById('card-basket') as HTMLTemplateElement
        ), { onClick: () => events.emit('basket:remove', item) }
    );
    return basketCard.render({index: ++index, ...item});
    })

    const isEmpty = productCart.getCartCount() === 0

    const basket = new Basket(
        cloneTemplate(
            document.getElementById('basket') as HTMLTemplateElement
        ), { onClick: () => events.emit('basket:order')}
    )

    modal.render({
        content: basket.render({ 
            order: orderCards, 
            totalPrice: productCart.getAllPrices(), 
            empty: isEmpty
        })
    })
    
    modalContainer?.classList.add('modal_active')

}

function ContactsErrors(errors: ValidationErrors): string {
    return (errors.email || errors.phone || '')
}

function updateContacts(form: FormContacts) {
    const errors = buyer.validateData(['email', 'phone'])

    const isValid = Object.keys(errors).length === 0;

    form.render({
        valid: isValid,
        error: ContactsErrors(errors),
        email: buyer.getAllData().email,
        phone: buyer.getAllData().phone,
    })
}

function generateContacts() {
    const formContacts = new FormContacts(
        cloneTemplate(
            document.getElementById('contacts') as HTMLTemplateElement
        ), {
            onEmailChange: (value) => {
                buyer.saveEmail(value);
                updateContacts(formContacts);
            },
            onPhoneChange: (value) => {
                buyer.savePhone(value);
                updateContacts(formContacts);
            },
            onSubmit() {
                const errors = buyer.validateData(['email', 'phone'])
                const isValid = Object.keys(errors).length === 0;
                if (!isValid) {
                    updateContacts(formContacts);
                    return;
                }
                events.emit('contacts:submit');
            },
        })
    modal.render({
        content: formContacts.render()
    })
    updateContacts(formContacts)
}

function OrderErrors(errors: ValidationErrors): string {
    return (errors.payment || errors.address || '')
}

function updateOrder(form: FormOrder) {
    const errors = buyer.validateData(['payment', 'address'])

    const isValid = Object.keys(errors).length === 0;

    form.render({
        valid: isValid,
        error: OrderErrors(errors),
        payment: buyer.getAllData().payment,
        address: buyer.getAllData().address,
    })
}

function generateOrder() {
    const formOrder = new FormOrder(
        cloneTemplate(
            document.getElementById('order') as HTMLTemplateElement
        ), {
            onPaymentChange: (method) => {
                buyer.savePayment(method);
                updateOrder(formOrder);
            },
            onAddressChange: (value) => {
                buyer.saveAddress(value);
                updateOrder(formOrder);
            },
            onSubmit: () => {
                const errors = buyer.validateData(['payment', 'address']);
                const isValid = Object.keys(errors).length === 0;
                if (!isValid) {
                    updateOrder(formOrder);
                    return;
                }
                events.emit('order:submit')
            }
        })
    modal.render({
        content: formOrder.render()
    })
    updateOrder(formOrder)
}

function sendOrder(){
    const idArr: string[] = [];

    productCart.getCartItems().forEach((item) => {
            idArr.push(item.id)
        })

    const orderData: IOrder = {
        ...buyer.getAllData(),
        total: productCart.getAllPrices(),
        items: idArr
    }

    serverData.postQuery(orderData)
        .then((response) => {console.log(response)})
        .catch(error => console.error('Ошибка при отправке: ', error))
}

function dataClear() {
    productCart.clearCart()
    buyer.clearData()

    header.render({ counter: productCart.getCartCount() })
}

// События

header.render({ counter: productCart.getCartCount() })

events.on('modal:close', () => modalContainer?.classList.remove('modal_active'))

events.on('basket:open', () => {generateBasket()})

events.on('basket:remove', (item: IProduct) => {
    productCart.removeItem(item)
    generateBasket()
    header.render({ counter: productCart.getCartCount() })
})

events.on('card:select', (item: IProduct) => { generatePreview(item) })

events.on('basket:add', (item: IProduct) => {
    productCart.addItem(item)
    generatePreview(item)
    header.render({ counter: productCart.getCartCount() })
})

events.on('card:remove', (item: IProduct) => {
    productCart.removeItem(item)
    generatePreview(item)
    header.render({ counter: productCart.getCartCount() })
})

events.on('basket:order', () => {
  generateOrder();
});

events.on('order:submit', () => {
  generateContacts();
});

events.on('contacts:submit', () => {
    const order = new OrderSuccess(
        cloneTemplate(
            document.getElementById('success') as HTMLTemplateElement
        ), { onClick: () => events.emit('modal:close') }
    );

    modal.render({
        content: order.render(
            { description: `Списано ${productCart.getAllPrices()} синапсов`}
        )
    })
    sendOrder()
    dataClear()
})
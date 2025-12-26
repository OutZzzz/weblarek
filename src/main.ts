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
import { IOrder, IProduct, TPayment, ValidationErrors } from './types';
import { FormOrder } from './components/views/Form/FormOrder';
import { FormContacts } from './components/views/Form/FormContacts';
import { OrderSuccess } from './components/views/Form/OrderSuccess';


// Модели данных
const events = new EventEmitter()

const productModel = new Catalog(events);
const productCart = new Cart(events);
const buyer = new BuyerData(events);

// Данные с сервера

const api = new Api(API_URL)
const serverData = new Queryes(api)

serverData.getQuery()
    .then(data => {
        data.items.forEach((item) => {
            item.image = CDN_URL + item.image
        })
        productModel.setCatalogItems(data.items) 
    }).catch(error => console.error('Произошла ошибка: ', error))

//Контейнеры для отображения

const galleryContainer = document.querySelector('.gallery')
const modalContainer = document.getElementById('modal-container')
const containerHeader = document.querySelector('.header__container')

// Объекты


const gallery = new Gallery(galleryContainer as HTMLElement)
const header = new Header(events, containerHeader as HTMLElement)
const modal = new Modal(events, modalContainer as HTMLElement)

// События

/* ----------- События модалки -------------- */

let currentModal: 'order' | 'contacts' | 'basket' | 'success' | null;

events.on('modal:close', () => {
    modalContainer?.classList.remove('modal_active')
    currentModal = null;
})

modalContainer?.addEventListener('click', (event) => {
    if (event.target === modalContainer) {
        events.emit('modal:close')
    }
})

/* ----------- События каталога -------------- */

events.on('catalog:changed', () => {
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

events.on('card:select', (item: IProduct) => {
    const itemExist = productCart.checkItemExist(item.id);
    const itemNullPrice = productModel.getItembyID(item.id)?.price === null

    let buttonText: string = itemExist ? 'Удалить из корзины' : 'Купить'
    let disabled: boolean = false

    if (itemNullPrice) {
        buttonText = 'Недоступно'
        disabled =  true
    }

    const preview = new CardPreview(
        cloneTemplate(
            document.getElementById('card-preview') as HTMLTemplateElement
        ), {
            onClick: () => {
                events.emit(itemExist ? 'basket:remove' : 'basket:add', item);
                events.emit('modal:close');}
            }
    )
    modal.render({
        content: preview.render({button: {text: buttonText, disabled: disabled}, ...item})
    })
    modalContainer?.classList.add('modal_active')
})

events.on('basket:add', (item: IProduct) => {
    productCart.addItem(item);
})

events.on('basket:remove', (item: IProduct) => {
    productCart.removeItem(item);
})

events.on('basket:changed', () => {
    header.render({ counter: productCart.getCartCount() });

    if (currentModal === 'basket') {
        generateBasket()
    }
});

/* ----------- События корзины -------------- */

function generateBasket() {
    const orderCards = productCart.getCartItems().map((item, index) => {
        const basketCard = new CardBasket(
            cloneTemplate(document.getElementById('card-basket') as HTMLTemplateElement),
            { onClick: () => events.emit('basket:remove', item) }
        );
        return basketCard.render({index: ++index, ...item});
    })

    const basket = new Basket(
        cloneTemplate(document.getElementById('basket') as HTMLTemplateElement),
        { onClick: () => events.emit('basket:order')}
    )

    modal.render({
        content: basket.render({
            order: orderCards,
            totalPrice: productCart.getAllPrices(),
            empty: productCart.getCartCount() === 0
        })
    })

    modalContainer?.classList.add('modal_active')
}

events.on('basket:open', () => {
    currentModal = 'basket'
    generateBasket()
})

/* ----------- События Оформления 1 этап -------------- */


function generateOrder() {
    const orderForm = new FormOrder(
        cloneTemplate(document.getElementById('order') as HTMLTemplateElement),
        {
            onPaymentChange: (method) => buyer.savePayment(method),
            onAddressChange: (value) => buyer.saveAddress(value),
            onSubmit: () => {
                const errors = buyer.validateData(['payment', 'address']);
                if (Object.keys(errors).length === 0) {
                    events.emit('order:submit');
                }
            }
        }
    )
    return orderForm
}

function OrderErrors(errors: ValidationErrors): string {
    return (errors.payment || errors.address || '')
}

const orderForm = generateOrder();

events.on('basket:order', () => { 
    currentModal = 'order';
    modal.render({
        content: orderForm.render()
    })
})

/* ----------- События Оформления 2 этап -------------- */
function generateContacts() {
    const orderContacts = new FormContacts(
        cloneTemplate(document.getElementById('contacts') as HTMLTemplateElement),
        {
            onEmailChange: (value) => buyer.saveEmail(value),
            onPhoneChange: (value) => buyer.savePhone(value),
            onSubmit: () => {
                const errors = buyer.validateData(['email', 'phone']);
                if (Object.keys(errors).length === 0) {
                    events.emit('contacts:submit');
                }
            }
        }
    )
    return orderContacts
}

function ContactsErrors(errors: ValidationErrors): string {
    return (errors.email || errors.phone || '')
}

const contactsForm = generateContacts();

events.on('order:submit', () => {
    currentModal = 'contacts'
    modal.render({
        content: contactsForm.render()
    })
})

events.on('buyer:changed', () => {
    const errorsOrder = buyer.validateData(['payment', 'address']);
    const errorsContacts = buyer.validateData(['email', 'phone'])

    switch(currentModal) {
        case 'order':
            orderForm.render({
                payment: buyer.getAllData().payment as TPayment,
                address: buyer.getAllData().address,
                valid: Object.keys(errorsOrder).length === 0,
                error: OrderErrors(errorsOrder)
            })
            break
        case 'contacts':
            contactsForm.render({
                email: buyer.getAllData().email,
                phone: buyer.getAllData().phone,
                valid: Object.keys(errorsContacts).length === 0,
                error: ContactsErrors(errorsContacts)
            })
            break
    }
})

/* ----------- События Отправки на сервер -------------- */

function orderData() {
    const idsArr: string[] = [];

    productCart.getCartItems().forEach((item) => {
        idsArr.push(item.id)
    })

    const data: IOrder = {
        ...buyer.getAllData(),
        total: productCart.getAllPrices(),
        items: idsArr
    }
    return data
}

function dataClear() {
    productCart.clearCart()
    buyer.clearData()
}

events.on('contacts:submit', () => {
    currentModal = 'success'

    const order = new OrderSuccess(
        cloneTemplate(document.getElementById('success') as HTMLTemplateElement),
        { onClick: () => events.emit('modal:close') }
    );

    modal.render({
        content: order.render(
            { description: `Списано ${productCart.getAllPrices()} синапсов` }
        )
    })
    serverData.postQuery(orderData())
        .then((response) => {console.log(response)})
        .catch(error => console.error('Ошибка при отправке: ', error))
        .finally(() => dataClear())
})

import { Api } from './components/base/Api';
import { BuyerData } from './components/models/BuyerData';
import { Cart } from './components/models/Cart';
import { Catalog } from './components/models/Catalog';
import { Queryes } from './components/models/Queryes';
import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';
import { CardCatalog } from './components/views/Card/CardCatalog';
import { cloneTemplate } from './utils/utils';
import { IHeader, Header } from './components/views/Header';
import { EventEmitter } from './components/base/Events';
import { IModal, Modal } from './components/views/Modal';
import { Gallery } from './components/views/Gallery';
import { CardPreview } from './components/views/Card/CardPreview';
import { CardBasket } from './components/views/Card/CardBasket';
import { Basket } from './components/views/Basket';


// Модели данных

const productModel = new Catalog();
const productCart = new Cart();
const buyer = new BuyerData();

// Тестовые данные

productCart.addItem({
    id: '854cef69-976d-4c2a-a18c-2aa45046c390',
    description: 'Если планируете решать задачи в тренажёре, берите два.',
    image: '/5_Dots.svg',
    title: '+1 час в сутках',
    category: 'софт-скил',
    price: 750
})

productCart.addItem({
    id: 'c101ab44-ed99-4a54-990d-47aa2bb4e7d9',
    description: 'Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.',
    image: '/Shell.svg',
    title: 'HEX-леденец',
    category: 'другое',
    price: 1450
})



// Данные с сервера

const api = new Api(API_URL)
const serverData = new Queryes(api)

//Контейнеры для отображения

const galleryContainer = document.querySelector('.gallery')
const modalContainer = document.getElementById('modal-container')
const containerHeader = document.querySelector('.header__container')
const cloneSuccess = cloneTemplate(document.getElementById('success') as HTMLTemplateElement)


// Объекты

const events = new EventEmitter()

const gallery = new Gallery(galleryContainer as HTMLElement)
const header = new Header(events, containerHeader as HTMLElement)
const modal = new Modal(events, modalContainer as HTMLElement)


// События
header.render({ counter: productCart.getCartCount() })

events.on('modal:close', () => modalContainer?.classList.remove('modal_active'))

events.on('basket:open', () => {

    const orderCards = productCart.getCartItems().map((item, index) => {
        console.log(item);
        const basketCard = new CardBasket(
            cloneTemplate(document.getElementById('card-basket') as HTMLTemplateElement
        )
    );
    /* console.log(basketCard.render({index: ++index, ...item})) */
    return basketCard.render({index: ++index, ...item});
    })

    const basket = new Basket(
        cloneTemplate(
            document.getElementById('basket') as HTMLTemplateElement
        )
    )

    modal.render({
        content: basket.render({ order: orderCards, totalPrice: productCart.getAllPrices() })
    })
    
    modalContainer?.classList.add('modal_active')
})

events.on('card:select', (item) => {
    const preview = new CardPreview(
        cloneTemplate(
            document.getElementById('card-preview') as HTMLTemplateElement
        )
    );
    modal.render({
        content: preview.render(item)
    });

    console.log(item)

    if (modalContainer) {
        modalContainer.classList.add('modal_active');
    }
})

serverData.getQuery()
    .then(data => {
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

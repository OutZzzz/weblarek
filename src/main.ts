import { Api } from './components/base/Api';
import { BuyerData } from './components/models/BuyerData';
import { Cart } from './components/models/Cart';
import { Catalog } from './components/models/Catalog';
import { Queryes } from './components/models/Queryes';
import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';


const productModel = new Catalog();

productModel.setCatalogItems(apiProducts.items);

console.log('Массив товаров из каталога: ', productModel.getCatalogItems())
console.log('Выбранный товар из массива если не выбран: ', productModel.getItemData())

productModel.setItemData(apiProducts.items[0]);
console.log('Выбранный товар из массива: ', productModel.getItemData())
console.log('Полученная запись по ИД:', productModel.getItembyID('b06cde61-912f-4663-9751-09956c0eed67'))


const productCart = new Cart();

productCart.addItem(apiProducts.items[1]);

console.log('Продукты в корзине: ', productCart.getCartItems())

productCart.removeItem(apiProducts.items[1])

console.log('Продукты в корзине после удаления: ', productCart.getCartItems())

productCart.addItem(apiProducts.items[1]);
productCart.addItem(apiProducts.items[0]);

console.log('Продукты в корзине: ', productCart.getCartItems())
console.log('Сумма продуктов в корзине: ', productCart.getAllPrices())
console.log('Проверка наличия товара в корзине по id: ', productCart.checkItemExist('b06cde61-912f-4663-9751-09956c0eed67'))
console.log('Проверка наличия товара в корзине по id: ', productCart.checkItemExist('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'))

productCart.clearCart();
console.log('Продукты в корзине после очистки корзины: ', productCart.getCartItems())


const buyer = new BuyerData();

console.log('Данные пользователя: ', buyer.getAllData())
console.log('Валидация данных:', buyer.validateData())

buyer.savePayment('card')
console.log('Валидация данных:', buyer.validateData())

buyer.saveAddress('Moscow')
console.log('Валидация данных:', buyer.validateData())

buyer.savePhone('12341234124')
console.log('Валидация данных:', buyer.validateData())

buyer.saveEmail('test@test.test')
console.log('Валидация данных:', buyer.validateData())

console.log('Данные пользователя: ', buyer.getAllData())

const api = new Api(API_URL)
const serverData = new Queryes(api)

console.log('Данные с сервера: ', serverData.getQuery())

import { Cart } from './components/models/Cart';
import { Catalog } from './components/models/catalog';
import './scss/styles.scss';
import { apiProducts } from './utils/data';


const productModel = new Catalog();

productModel.setCatalogItems(apiProducts.items);
productModel.setItemData(apiProducts.items[0]);

console.log('Массив товаров из каталога: ', productModel.getCatalogItems())
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
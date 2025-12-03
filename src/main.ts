import { Catalog } from './components/models/catalog';
import './scss/styles.scss';
import { apiProducts } from './utils/data';


const productModel = new Catalog();

productModel.setCatalogItems(apiProducts.items);
productModel.setItemData(apiProducts.items[0])

console.log('Массив товаров из каталога: ', productModel.getCatalogItems())
console.log('Выбранный товар из массива: ', productModel.getItemData())
console.log('Полученная запись по ИД:', productModel.getItembyID('b06cde61-912f-4663-9751-09956c0eed67'))
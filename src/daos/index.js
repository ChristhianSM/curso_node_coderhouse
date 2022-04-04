import CartDaoFs from './carts/CartDaoFs.js';
import CartDaoMemory from './carts/CartDaoMemory.js';
import CartDaoMongo from './carts/CartDaoMongo.js';
import CartDaoMysql from './carts/CartDaoMysql.js';
import ProductDaoFs from './products/ProductDaoFs.js';
import ProductDaoMemory from './products/ProductDaoMemory.js';
import ProductDaoMongo from './products/ProductDaoMongo.js';
import ProductDaoMysql from './products/ProductDaoMysql.js';

const dbToUse = 'mongo';
let productDao;
let cartDao

switch (dbToUse) {
    case 'memory':
        productDao = new ProductDaoMemory();
        cartDao = new CartDaoMemory();
        break;
    case 'fs':
        productDao = new ProductDaoFs();
        cartDao = new CartDaoFs();
        break;
    case 'mongo':
        productDao = new ProductDaoMongo();
        cartDao = new CartDaoMongo();
        break;
    case 'mysql':
        productDao = new ProductDaoMysql();
        cartDao = new CartDaoMysql();
        break;
    default:
        break;
}

export  {
    productDao,
    cartDao
}
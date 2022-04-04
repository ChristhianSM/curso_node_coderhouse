import CartDaoFs from './carts/CartDaoFs.js';
import CartDaoMongo from './carts/CartDaoMongo.js';
import CartDaoMysql from './carts/CartDaoMysql.js';
import ProductDaoFs from './products/ProductDaoFs.js';
import ProductDaoMongo from './products/ProductDaoMongo.js';
import ProductDaoMysql from './products/ProductDaoMysql.js';


const dbToUse = 'fs';
let productDao;
let cartDao

switch (dbToUse) {
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
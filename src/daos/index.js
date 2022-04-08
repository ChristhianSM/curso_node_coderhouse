
const dbToUse = 'memory';
let productDao;
let cartDao;

//Para aplicar test
let productTestDao;

switch (dbToUse) {
    case 'memory':
        const { default : ProductDaoMemory }  = await import('./products/ProductDaoMemory.js');
        const { default : CartDaoMemory } = await import('./carts/CartDaoMemory.js');
        const { default : ProductTestDaoMemory }  = await import('./productsTest/ProductTestDaoMemory.js');

        productDao = new ProductDaoMemory();
        cartDao = new CartDaoMemory();
        productTestDao = new ProductTestDaoMemory();

        break;
    case 'fs':
        const { default : ProductDaoFs }  = await import('./products/ProductDaoFs.js');
        const { default : CartDaoFs } = await import('./carts/CartDaoFs.js');
        productDao = new ProductDaoFs();
        cartDao = new CartDaoFs();
        break;
    case 'mongo':
        const { default : ProductDaoMongo }  = await import('./products/ProductDaoMongo.js');
        const { default : CartDaoMongo } = await import('./carts/CartDaoMongo.js');
        productDao = new ProductDaoMongo();
        cartDao = new CartDaoMongo();
        break;
    case 'mysql':
        const { default : ProductDaoMysql }  = await import('./products/ProductDaoMysql.js');
        const { default : CartDaoMysql } = await import('./carts/CartDaoMysql.js');

        productDao = new ProductDaoMysql();
        cartDao = new CartDaoMysql();
        break;
    default:
        break;
}

export  {
    productDao,
    cartDao,
    productTestDao
}
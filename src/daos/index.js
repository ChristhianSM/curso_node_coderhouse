import path from 'path'
import ContainerProductFs from "../containers/product/useManagerProductFs.js";
import ContainerCartFs from '../containers/cart/userManagerCartFs.js'

import ContainerProdcutMongo from "../containers/product/userManagerProductMongo.js";
import ContainerCartMongo from "../containers/cart/userManagerCartMongo.js";

import ContainerProductMysql from '../containers/product/userManagerProductMysql.js'
import ContainerCartMysql from '../containers/cart/userManagerCartMysql.js'
import { __dirname } from '../helpers/getDirname.js'

const dbToUse = 'mysql';
let productDao;
let cartDao

switch (dbToUse) {
    case 'fs':
        productDao = new ContainerProductFs(path.join(__dirname + "/../files/products.txt"));
        cartDao = new ContainerCartFs(path.join(__dirname + "/../files/cart.txt"), path.join(__dirname + "/../files/products.txt"));
        break;
    case 'mongo':
        productDao = new ContainerProdcutMongo('product');
        cartDao = new ContainerCartMongo();
        break;
    case 'mysql':
        productDao = new ContainerProductMysql('products');
        cartDao = new ContainerCartMysql();
        break;
    default:
        break;
}

export  {
    productDao,
    cartDao
}
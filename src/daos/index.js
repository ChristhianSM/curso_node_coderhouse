import path from 'path'
import ContainerProductFs from "../containers/useManagerProductFs.js";
import ContainerCartFs from '../containers/userManagerCartFs.js'
import ContainerProdcutMongo from "../containers/userManagerProductMongo.js";
import ContainerCartMongo from "../containers/userManagerCartMongo.js";
// import ContainerCartMongo from "../containers/.js";
import { __dirname } from '../helpers/getDirname.js'

const dbToUse = 'fs';
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
    
    default:
        break;
}

export  {
    productDao,
    cartDao
}
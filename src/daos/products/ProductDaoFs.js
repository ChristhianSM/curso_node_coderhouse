import path  from 'path'
import Container from '../../containers/containerFs.js';
import { __dirname } from '../../helpers/getDirname.js';

console.log(path.join(__dirname + "/../files/products.txt"));

class ProductDaoFs extends Container {
    constructor() {
        super(path.join(__dirname + "/../files/products.txt"));
    }
}

export default ProductDaoFs
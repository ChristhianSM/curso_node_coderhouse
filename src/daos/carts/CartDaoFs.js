import path from 'path'
import Container from '../../containers/containerFs.js';
import { __dirname } from '../../helpers/getDirname.js';

class CartDaoFs extends Container {
    constructor() {
        super(path.join(__dirname + "/../files/cart.txt"));
    }
}
export default CartDaoFs
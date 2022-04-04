import Container from '../../containers/containerMongo.js';

class CartDaoMongo extends Container {
    constructor() {
        super('carts');
    }
}
export default CartDaoMongo
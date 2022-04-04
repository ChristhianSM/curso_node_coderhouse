import Container from '../../containers/containerMysql.js';

class CartDaoMysql extends Container {
    constructor() {
        super('carts');
    }
}
export default CartDaoMysql
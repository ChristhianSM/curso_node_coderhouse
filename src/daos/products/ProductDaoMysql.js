import Container from '../../containers/containerMysql.js';

class ProductDaoMysql extends Container {
    constructor() {
        super('products');
    }
}
export default ProductDaoMysql
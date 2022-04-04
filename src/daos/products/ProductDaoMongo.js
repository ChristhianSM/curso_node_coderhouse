import Container from '../../containers/containerMongo.js';

class ProductDaoMongo extends Container {
    constructor() {
        super('products');
    }
}
export default ProductDaoMongo
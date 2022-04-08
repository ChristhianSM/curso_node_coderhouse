import Container from '../../containers/containerMemory.js';
import faker  from 'faker';

class ProductTestDaoMemory extends Container {
    constructor() {
        super();
    }

    popular(cant = 10) {
        const news = [];
        for (let i = 0; i < cant; i++) {
            const newProduct = {
                id : faker.datatype.uuid(),
                name : faker.commerce.productName(),
                description : faker.commerce.productDescription(),
                price : faker.commerce.price(),
                img: "https://random.imagecdn.app/100/100",
                status: true
            }
            news.push(newProduct);
        }
        this.elements = news;
        return this.elements;
    }
}

export default ProductTestDaoMemory
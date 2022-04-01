import { cartDao } from '../daos/index.js'

const createCart = async (req, res) => {
    const result = await cartDao.createCart();
    res.status(result.status === "success" ? 200 : 400).json(result);
}

const deleteCart = async (req, res) => {
    const idCart = req.params.id;

    const result = await cartDao.deleteCart(idCart);
    res.status(result.status === "success" ? 200 : 400).json(result);
}

const getProdcutsByCart = async (req, res) => {
    const idCart = req.params.id_cart;

    const result = await cartDao.getProductsForCart(idCart);
    res.status(result.status === "success" ? 200 : 400).json(result);
}

const postProductsByCart = async (req, res) => {
    const idCart = req.params.id_cart;
    const idProduct = req.body.id_product;

    const result = await cartDao.addProductToCart(idCart, idProduct);
    res.status(result.status === "success" ? 200 : 400).json(result);
}

const deleteProductFromCart = async (req, res) => {
    const idCart = req.params.id_cart;
    const idProduct = req.params.id_product;

    const result = await cartDao.deleteProductToCart(idCart, idProduct);
    res.status(result.status === "success" ? 200 : 400).json(result);
}

const deleteProduct = async (req, res) => {
    const idCart = req.params.id_cart;
    const idProduct = req.params.id_product;
    console.log(idCart, idProduct)
    const result = await cartDao.deleteProduct(idCart, idProduct);
    res.status(result.status === "success" ? 200 : 400).json(result);
}

export {
    createCart,
    deleteCart,
    getProdcutsByCart,
    postProductsByCart,
    deleteProductFromCart,
    deleteProduct
}
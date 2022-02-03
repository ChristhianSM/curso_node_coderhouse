
const { Contenedor } = require('./models/UserManagerProducts');

const aceite = {
    name:"aceite", 
    price : 5.50 , 
    thumbail : "https"
}

const arroz = {
    name:"Arroz", 
    price : 10.50 , 
    thumbail : "https"
}

const azucar = {
    name:"Azucar", 
    price : 8.50, 
    thumbail : "https"
}
const main = async () => {
    const product1 = new Contenedor("./files/products.txt");

    //Metodo para guardar productos en el archivo products.txt
    console.log( await product1.save(arroz));
    console.log( await product1.save(aceite));
    console.log( await product1.save(azucar));
    // console.log( await product1.save(arroz));

    //Metodo para buscar todos los productos 
    // console.log(await product1.getAll());

    //Metodo para eliminar un producto 
    //console.log(await product1.deleteById(2));

    //Metodo para eliminar todos los productos del txt 
    //console.log(await product1.deleteAll());

}

main();


 


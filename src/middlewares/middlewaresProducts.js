const { request, response } = require('express');

//Creamos la variable ADMIN
const ADMIN = true;
const middlewareAuth = (req=request, res=response , next) => {
    
    // const isAuth = req.body.rol;
    if (!ADMIN) {
        res.status(400).send({
            meesage : "Ruta no autorizada",
            description : 'route /products unauthorized post method'
        })
    }else{
        next();
    }
}

module.exports = {
    middlewareAuth
}
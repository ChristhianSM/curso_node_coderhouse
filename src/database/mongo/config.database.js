import mongoose from "mongoose";
import dotenv from 'dotenv';
//Para leer variables de entorno
dotenv.config();

const dbConnection = () => {
    try {
        mongoose.connect(process.env.MONGODB_CNN);
        console.log("Base de datos online Mongo")
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos')
    }
}

export {
    dbConnection
}
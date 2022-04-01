import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const ProductsSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is requerid']
    },
    code : {
        type : String,
        required : [true, 'Email is requerid'],
        unique : true,
    },
    price: {
        type: Number,
        required: [true, 'Price is requerid']
    },
    img: {
        type: String
    },
    description : {
        type: String
    },
    stock : {
        type : Number,
        required: [true, 'Stock of Product is requerid']
    }, 
    status : {
        type: Boolean, 
        default : true
    }, 
    timestamp : {
        type : Date, 
        required: [true, 'Timestamp of Product is requerid']
    }
})

const modelProduct = model('Product', ProductsSchema);

export default modelProduct
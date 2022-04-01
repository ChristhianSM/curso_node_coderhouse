import mongoose from 'mongoose'
const { Schema, model } = mongoose;

const CartsSchema = new Schema({
    timestamp : {
        type: Number,
        required:[true, 'Timestamp is requerid']
    },
    products : {
        type: Array,
    }
})

const modelCart = model('Cart', CartsSchema);

export default modelCart;
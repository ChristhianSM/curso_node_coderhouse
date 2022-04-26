import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    email: {
        type : String,
        required : [true, 'Email is requerid']
    },
    password: {
        type : String,
        required : [true, 'Password is requerid']
    },
    name: {
        type : String,
        required : [true, 'Name is requerid']
    },
})

const modelUser = model('User', UserSchema);

export default modelUser
import multer from 'multer';
import path from 'path'
import { __dirname } from '../helpers/getDirname.js'

let storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, path.join(__dirname + '/../public/img'))
    },
    filename : function(req, file, callback) {
        callback(null, `${Date.now()} - ${file.originalname}`)
    }
})

const uploader = multer({storage})

export default uploader;
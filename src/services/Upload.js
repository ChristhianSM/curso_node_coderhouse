const multer = require('multer');
const path = require('path')

let storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, path.join(__dirname + '/../public/img'))
    },
    filename : function(req, file, callback) {
        callback(null, `${Date.now()} - ${file.originalname}`)
    }
})

const uploader = multer({storage})

module.exports = uploader;
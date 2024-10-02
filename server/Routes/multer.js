const multer = require('multer')
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        return cb(null, "public/Images");
    },
    filename: function(req, file, cb) {
        return cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    } 
})

const upload = multer({storage});

module.exports = upload;
const mongoose = require('mongoose');

const otpsSchema = new mongoose.Schema({
    email: {type: String, required: true},
    otp: {type: String, required: true}
})

const Otps = mongoose.model('otps' ,otpsSchema);
module.exports = Otps;
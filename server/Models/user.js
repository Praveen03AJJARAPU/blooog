const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    googleId: {type: String, unique: true},
    name: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String},
    profile_picture: {type: String, required: true},
    blogs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Blog'}],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
})

const User = mongoose.model('User', userSchema);
module.exports = User;
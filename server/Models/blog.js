const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    text: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
})

const blogSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    image: {type: String, required: true},
    tags: [{type: String, required: true}],
    subTitle: {type: String, required: true},
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    comments: [commentSchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
})

const Blog = mongoose.model('Blog', blogSchema);
const Comment = mongoose.model('Comment', commentSchema)

module.exports = {Blog, Comment};
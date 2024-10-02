const { createBlog, getBlogs, searchBlogs, likeBlogs, commentBlogs, fetchComments } = require('../Controllers/blogController');
const express = require('express');
const upload = require('./multer');
const router = express.Router();

router.post('/create', upload.single("image", 2), createBlog);
router.get('/get/:tag', getBlogs);
router.get('/search/:id', searchBlogs);
router.get('/getComments/:id', fetchComments);

router.post('/like', likeBlogs);
router.post('/comment', commentBlogs);


module.exports = router
const {Blog, Comment} = require('../Models/blog');
const User = require('../Models/user');


module.exports.createBlog = async(req, res) => {
    const {username, title, content, subTitle, tags} = req.body;
    const image = req.file ? req.file.filename : null;
    try {
        const newBlog = new Blog({
            title, 
            content, 
            image, 
            subTitle, 
            tags: JSON.parse(tags),
            creator: username
        });
        await newBlog.save();
        const user = await User.findById(username); 

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.blogs.push(newBlog._id);
        await user.save();
        res.status(200).json(newBlog);
    } catch (error) {
        res.status(400).json(error);
        console.log(error);
    }
} 


module.exports.getBlogs = async(req, res) => {
    try {
        const tag = req.params.tag;
        var blogs;
        if(tag === 'any') {
            blogs = await Blog.find({}).populate('creator').exec();
        } else {
            blogs = await Blog.find({ tags: { $in: [tag] } })
              .populate("creator")
              .exec();
        }
        res.status(200).json(blogs);
    } catch(err) {
        res.status(500).json(err.message);
    }
}

module.exports.searchBlogs = async(req, res) => {
    try {
        const id = req.params.id;
        const blog = await Blog.findById(id).populate('creator'); 
        res.status(200).json(blog);
    } catch(err) {
        res.status(500).json(err.message);
    }
}

module.exports.likeBlogs = async(req, res) => {
    try {
        const {blogId, userId} = req.body;
       

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json("Blog not found");
        }

        if(!blog.likes.includes(userId)) {
            blog.likes.push(userId)
        } else {
            blog.likes = blog.likes.filter((id) => id.toString() !== userId);
        }
        await blog.save();
        res.status(200).json(blog.likes);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

module.exports.commentBlogs = async(req, res) => {
    try {
        const {blogId, userId, comment} = req.body;

        if (!comment || comment.trim() === '') {
            return res.status(400).json("Add a comment to post");
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json("Blog not found");
        }

        const newComment = new Comment({
            userId, 
            text: comment,
            createdAt: new Date(),
        });
        await newComment.save();
        blog.comments.push(newComment);
        await blog.save(); 
        res.status(200).json(newComment);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

module.exports.fetchComments = async(req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);

        if(!blog) {
            res.status(500).json('No blog found. Error!');
        }

        blog.populate({
            path: 'comments.userId',
            model: 'User' 
        })
          .then((populatedBlog) => {
            res.status(200).json(populatedBlog.comments);
          })
        
    } catch (err) {
        res.status(500).json(err.message);
    }
}
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

module.exports.getSaved = async(req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findOne({ _id: id })
          .populate("saved")
          .exec()
          .then(u => {
            res.status(200).json(u.saved);
          })
          .catch((err) => {
            res.status(500).json(err);
          })
    } catch (error) {
        res.status(500).json(error.message);
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

        const io = req.app.get('socketio');
        io.emit('newLike', {blogId, likes: blog.likes});

        await blog.save();
        res.status(200).json(blog.likes);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

module.exports.saveBlogs = async(req, res) => {
    try {
        const {blogId, userId} = req.body;
       

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json("User not found");
        }

        if(!user.saved.includes(blogId)) {
            user.saved.push(blogId)
        } else {
            user.saved = user.saved.filter((blog) => blog.toString() !== blogId.toString());
        }
        await user.save();
        res.status(200).json(user.saved);
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
        await newComment.populate("userId");
        // io.emit('commentAdded', newComment);
        await blog.save(); 
        res.status(200).json({newComment, blog});
    } catch (error) {
        res.status(500).json(error.message);
    }
}

// const deletedComment = await Comment.findById(commentId);
// console.log(deletedComment)
// if(!deletedComment) {
//     return res.status(404).json('Comment not found');
// }
module.exports.deleteComments = async(req, res) => {
    try {
        const { commentId, blogId } = req.params;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        
        blog.comments = blog.comments.filter((comment) => comment._id.toString() !== commentId);
        await blog.save(); 

        const populatedBlog = await blog.populate({
            path: 'comments.userId',
            model: 'User',
        });

        res.status(200).json(populatedBlog.comments);
    }catch(err) {
        res.status(500).json(err);
    }
}



module.exports.fetchComments = async(req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);

        if(!blog) {
            res.status(500).json('No blog found. Error!');
        }

        const populatedBlog = await blog.populate({
            path: 'comments.userId',
            model: 'User',
        });

        res.status(200).json(populatedBlog.comments.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
        
    } catch (err) {
        res.status(500).json(err.message);
    }
}

// module.exports.getSuggestions

module.exports.searchTerms = async(req, res) => {
    try {
        const term = req.query.q;
        if(!term) {
            return res.status(400).json('No term is included');
        }
        const topics = await Blog.find({
          tags: {
            $elemMatch: {
              $regex: term,
              $options: "i",
            },
          },
        });
        const tags = await Blog.aggregate([
            {
              $match: {
                tags: { $elemMatch: { $regex: term, $options: 'i' } }
              }
            },
            {
              $unwind: "$tags"
            },
            {
              $match: {
                tags: { $regex: term, $options: 'i' }
              }
            },
            {
              $group: {
                _id: null,
                uniqueTags: { $addToSet: "$tags" }
              }
            },
            {
              $project: {
                _id: 0,
                uniqueTags: 1
              }
            }
          ]);
          
          
          
        const blogs = await Blog.find({
            $or: [
                {title: {$regex: term, $options: 'i'}}
            ]
        })
        const users = await User.find({
            $or: [
                {name: {$regex: term, $options: 'i'}}
            ]
        })
        return res.status(200).json({blogs, users, topics, tags});
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    
    module.exports.popularUsers = async(req, res) => {
      try {
        const mostFollowed = await User.aggregate([
          {
            $project: {
              name: 1,
              profile_picture: 2,
              count: { $size: "$followers" },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 3 },
        ]);
        return res.status(200).json(mostFollowed);
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports.getUsers = async(req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).populate([
          { path: "blogs", populate: { path: "creator" } },
          { path: "saved", populate: { path: "creator" } },
        ]);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error);   
    }
}

module.exports.updateUsers = async(req, res) => {
    try {
        
       const {name, bio, id} = req.body;
       var updUser;
       if(req.file) {
          updUser = await User.findByIdAndUpdate(
            id,
            { name: name, bio: bio, profile_picture: req.file.filename },
            { new: true, runValidators: true }
          );
        } else {
            updUser = await User.findByIdAndUpdate(
              id,
              { name: name, bio: bio },
              { new: true, runValidators: true }
            );

       }

       if(!updUser) {
        return res.status(404).json({message: "User not found"});
       }

       return res.status(200).json(updUser)
    } catch (error) {
        console.log(error) 
        return res.status(500).json(error.message);   
    }
}

module.exports.followUsers = async(req, res) => {
    try {
        const {userId, accId} = req.body;
        const user = await User.findById(userId);
        const acc = await User.findById(accId);
        if(!user || !acc) {
            return res.status(404).json({success: false, message: 'User not found'});
        }
        if(acc.followers.includes(userId)) {
            acc.followers = acc.followers.filter((id) => id.toString() !== userId)
            user.following = user.followers.filter((id) => id.toString() !== accId)
            
            await acc.save();
            await user.save();
            return res.status(200).json({success: true, message: 'Unfollowed', user, acc})
        } else {
            if (!acc.followers.includes(userId)) {
                acc.followers.push(userId);
            }
            if (!user.following.includes(accId)) {
              user.following.push(accId);
            }

            await acc.save();
            await user.save();

            return res.status(200).json({success: true, message: 'Following', user})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false,message: 'Internal server error'})
    }
}
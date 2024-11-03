const {
  createBlog,
  getBlogs,
  searchBlogs,
  likeBlogs,
  commentBlogs,
  fetchComments,
  deleteComments,
  saveBlogs,
  getSaved,
  searchTerms,
  popularUsers,
  getUsers,
  updateUsers,
  followUsers
} = require("../Controllers/blogController");
const express = require("express");
const upload = require("./multer");
const router = express.Router();

router.get("/get/:tag", getBlogs);
router.get("/getPopular", popularUsers);
router.get("/search/:id", searchBlogs);
router.get("/get", searchTerms);
router.get("/getUser/:id", getUsers);
router.get("/getSaved/:id", getSaved);
router.get("/getComments/:id", fetchComments);

router.post("/create", upload.single("image", 2), createBlog);
router.post("/like", likeBlogs);
router.post("/follow", followUsers);
router.post("/comment", commentBlogs);
router.post("/save", saveBlogs);
router.post("/updateUser", upload.single('profile_picture', 1), updateUsers);

router.delete("/deleteComment/:commentId/:blogId", deleteComments);

module.exports = router;

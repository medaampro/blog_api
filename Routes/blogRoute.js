const express = require('express');
const router = express.Router();

const { createBlog, getBlogs, getBlogsByCategoryId, getBlogsByUserId, getBlog, searchBlog } = require('../Controllers/blogController');
const { isAuth } = require("../Middlewares/authMiddleware");

router.get("/", getBlogs);
router.post('/create', [isAuth] , createBlog);
router.get('/category/:category_id', getBlogsByCategoryId);
router.get('/user/:user_id', getBlogsByUserId);
router.get('/:blog_id', getBlog);
router.get('/search/blogs', searchBlog);

module.exports = router;

const express = require('express');
const router = express.Router();

const { getComments, createComment, replyComment } = require("../Controllers/commentController");
const { isAuth } = require("../Middlewares/authMiddleware");

router.get("/comments/:blog_id", getComments);
router.post("/create", [isAuth] , createComment);
router.post("/reply_comment", [isAuth] , replyComment);

module.exports = router;

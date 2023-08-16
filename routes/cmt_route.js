const router = require("express").Router();
const {is_auth} = require("../middlewares/usr_middleware");
const {create_comment, reply_to_comment, get_comments} = require("../controllers/cmt_controller");

router.post("/create/:bid", [is_auth], create_comment);
router.post("/reply/:cid", [is_auth], reply_to_comment);
router.get("/:bid/comments", get_comments);

module.exports = router;

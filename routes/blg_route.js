const router = require("express").Router();
const {is_auth}    = require("../middlewares/usr_middleware");
const {blog_by_id} = require("../middlewares/blg_middleware");
const {create_blog, get_blog, get_blogs, get_blogs_by_category_id, get_blogs_by_user_id, search_blog}
      = require("../controllers/blg_controller");

router.post("/create", [is_auth], create_blog);
router.get("/:bid", get_blog);
router.get("/", get_blogs);
router.get("/category/:cid", get_blogs_by_category_id);
router.get("/user/:uid", get_blogs_by_user_id);
router.get("/search/blogs", search_blog);

router.param("bid", blog_by_id);

module.exports = router;

const router = require("express").Router();
const {is_auth, is_admin} = require("../middlewares/usr_middleware");
const {category_by_id}    = require("../middlewares/cat_middleware");
const {create_category, get_categories, update_category, delete_category} 
      = require("../controllers/cat_controller");

router.get("/", get_categories);
router.post("/create", [is_auth, is_admin], create_category);
router.patch("/update/:cid", [is_auth, is_admin], update_category);
router.delete("/delete/:cid", [is_auth, is_admin], delete_category);

router.param("cid", category_by_id);

module.exports = router;

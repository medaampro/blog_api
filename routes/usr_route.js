const router = require("express").Router();
const {is_auth, profile_by_id} = require("../middlewares/usr_middleware");
const {signup, activate_account, signin, signout, refresh_token_signin, google_signin, forgot_password, 
       reset_password, get_user, update_user} = require("../controllers/usr_controller.js");

router.post("/signup", signup);
router.get("/activate/:active_token", activate_account);
router.post("/signin", signin);
router.get("/signout", [is_auth], signout);
router.get("/refresh", refresh_token_signin);
router.post("/forgot_password", forgot_password);
router.post("/google_signin", google_signin);
router.get("/user/:uid", get_user);
router.patch("/user/:uid/update", [is_auth], update_user);
router.patch("/user/reset_password", [is_auth], reset_password);

router.param("uid", profile_by_id);

module.exports = router;

const express = require('express');
const router = express.Router();

const { updateUser, getUser, resetPassword } = require("../Controllers/userController");
const { isAuth } = require("../Middlewares/authMiddleware");

router.patch('/update', [isAuth], updateUser);
router.get('/:id', getUser);
router.patch('/reset_password', [isAuth], resetPassword);

module.exports = router;

const express = require('express');
const router = express.Router();

const { signup, activeAccount, signin, signout, RefreshToken, googleSignIn, facebookSignIn, smsSignIn, smsVerify, forgotPassword } = require('../Controllers/authController.js');
const { isAuth } = require('../Middlewares/authMiddleware');
const { userValidator } = require('../Middlewares/validationMiddleware');



router.post('/signup', [userValidator], signup);
router.post('/active', activeAccount);
router.post('/signin', signin);
router.get('/signout', [isAuth] , signout);
router.get('/RefreshToken', RefreshToken);
router.post('/googleSignIn', googleSignIn);
router.post('/facebookSignIn', facebookSignIn);
router.post('/smsSignIn', smsSignIn);
router.post('/smsVerify', smsVerify);
router.post('/forgotPassword', forgotPassword);



module.exports = router;

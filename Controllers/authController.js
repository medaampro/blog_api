const User = require('../Models/User');
const bcrypt = require('bcrypt');
const { generateActiveToken, verifyActiveToken, generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../Helpers/Tokens');
const { sendEmail } = require('../Helpers/sendEmail');
const { sendSMS, smsOTP, smsVerification } = require('../Helpers/sendSMS');
const { validateEmail, validatePhone } = require('../Middlewares/validationMiddleware');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(`${process.env.Client_Id}`);

exports.signup = async (req, res) => {
    
    try {
        const { name, account, password } = req.body;

        const user = await User.findOne({account});
        if(user) return res.status(400).json({errors: 'User already exist , Please change email or phone !!'});
    
        const hashedPassword = await bcrypt.hash(password, 12);
        if(!hashedPassword) return res.status(400).json({errors: "Can't hash data !!"});
    
        const data = { name, account, password: hashedPassword };
        const activeToken = generateActiveToken(data);
        const url = `${process.env.Client_Url}/active/${activeToken}`;
    
        if(validateEmail(account)){
            sendEmail(account, url, 'Verify Your Email Address');
            // return res.json({msg: 'SignUp Success ! Please Check Your email .'});
        }else if(validatePhone(account)){
            // sendSMS(account, url, 'Verify Your Phone Number');
            // return res.json({msg: 'SignUp Success ! Please Check Your Phone .'});
        }
    }catch (err){
        return res.status(500).json({errors: err.message});
    }

}

exports.activeAccount = (req, res) => {

    try{
        const { activeToken } = req.body;
        const decodedActiveToken = verifyActiveToken(activeToken);
        const newUser = new User(decodedActiveToken.data);

        newUser.save()
            .then(() => res.json({msg: "Account Activated Successfully, Welcome !!"}))
            .catch(err => {
                if(err.code === 11000){
                    res.status(400).json({errors: "Account Already Activated !!!"}); 
                }else{
                    let x = Object.keys(err.errors)[0];
                    res.status(400).json({errors: err.errors[`${x}`].message}); 
                }
            })

    }catch(err) {
        res.status(500).json({errors: "Error Token , Please Sign Up Again !!"});
    }

}

exports.signin = async (req, res) => {

    try {
        const { account, password } = req.body;

        const user =  await User.findOne({account});
        if(!user) return res.status(404).json({errors: "User don't exist !!"});
    
        const compare = await bcrypt.compare(password, user.password);
        const msgError = user.type === "register" ? 'Password is incorrect.' : `Password is incorrect. This account login with ${user.type}`;
        if(!compare) return res.status(404).json({errors: msgError});
    
        const AccessToken = generateAccessToken(user._id);
        const RefreshToken = generateRefreshToken(user._id);
    
        res.cookie('RefreshToken', RefreshToken, {
            httpOnly: true,
            path: '/api/RefreshToken',
            maxAge: 30*24*60*60*1000
        });
    
        const userUpdated = await User.findOneAndUpdate({_id: user._id}, {rf_token: RefreshToken});
        if(!userUpdated) return res.status(404).json({errors: "Can't Update User Token !!"});
    
        return res.json({msg: "SignIn Success !", AccessToken, User: { _id: userUpdated._id, name: userUpdated.name, role: userUpdated.role }});
    }catch (err){
        return res.status(500).json({errors: err.message});
    }

}

exports.signout = async (req, res) => {

    if(!req.user) return res.status(400).json({errors: "Invalid Authentication."});
    
    try {
        res.clearCookie('RefreshToken', { path: '/api/RefreshToken' } );
        const userUpdated = await User.findOneAndUpdate({_id: req.user._id}, {rf_token: ""});
        if(!userUpdated) return res.status(404).json({errors: "Can't Update User Token !!"});
        return res.json({msg: "SignOut Success !!"});
    }catch (err) {
        return res.status(500).json({errors: err.message});
    }

}

exports.RefreshToken = async (req, res) => {

    try {

        const RefreshToken = req.cookies.RefreshToken;
        if(!RefreshToken) return res.status(404).json({errors: "Please Sign In !!"});
        
        const decodedRefreshToken = verifyRefreshToken(RefreshToken);
        if(!decodedRefreshToken) return res.status(404).json({errors: "Please Sign In !!"});
        
        const user = await User.findById(decodedRefreshToken.data).select("-password +rf_token");
        if(!user) return res.status(404).json({errors: "User don't exist !!"});

        if(user.rf_token !== RefreshToken) return res.status(404).json({errors: "Please Sign In !!"});        

        const AccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        res.cookie('RefreshToken', newRefreshToken, {
            httpOnly: true,
            path: '/api/RefreshToken',
            maxAge: 30*24*60*60*1000
        });

        const userUpdated = await User.findOneAndUpdate({_id: user._id}, {rf_token: newRefreshToken});
        if(!userUpdated) return res.status(404).json({errors: "Can't Update User Token !!"});

        return res.json({msg: "Success !!", AccessToken, User: { _id: userUpdated._id, name: userUpdated.name, role: userUpdated.role }});

    }catch (err){
        return res.status(500).json({errors: err.message});
    }
 
}

exports.googleSignIn = async (req, res) => {

    const { id_token } = req.body;
    if(!id_token) return res.status(404).json({errors: "Please Sign In !!"}); 

    try {

        const verify = await client.verifyIdToken({ idToken: id_token, audience: `${process.env.Client_Id}` });
        const { name, email, email_verified } = verify.getPayload();
        
        if(!email_verified) return res.status(500).json({errors: "Email Verfification Failed !!"}); 

        const user = await User.findOne({account: email});

        if(user) {

            const AccessToken = generateAccessToken(user._id);
            const RefreshToken = generateRefreshToken(user._id);

            res.cookie('RefreshToken', RefreshToken, {
                httpOnly: true,
                path: '/api/RefreshToken',
                maxAge: 30*24*60*60*1000
            })

            const userUpdated = await User.findOneAndUpdate({_id: user._id}, {rf_token: RefreshToken});
            if(!userUpdated) return res.status(404).json({errors: "Can't Update User Token !!"});

            return res.json({msg: "SignIn Success !", AccessToken, User: { _id: userUpdated._id, name: userUpdated.name, role: userUpdated.role }});

        }else {

            const password =  `${email} your google secret password`;
            const hashedPassword = await bcrypt.hash(password, 12);
            if(!hashedPassword) return res.status(400).json({errors: "Can't hash data !!"});

            const newUser = new User({ name: name, account: email, password: hashedPassword, type: 'google' });

            const AccessToken = generateAccessToken(newUser._id);
            const RefreshToken = generateRefreshToken(newUser._id);

            newUser.rf_token = RefreshToken;

            newUser.save()
                    .then(data => {

                        res.cookie('RefreshToken', RefreshToken, {
                            httpOnly: true,
                            path: '/api/RefreshToken',
                            maxAge: 30*24*60*60*1000
                        });

                        return res.json({msg: "SignUp Success, You Are Connected Now !!", AccessToken, User: { _id: data._id, name: data.name, role: data.role }});
                    })
                    .catch(err => res.status(400).json({errors: err}))

        }

    } catch (err) {
        return res.status(500).json({errors: err.message}); 
    }


}

exports.facebookSignIn = async (req, res) => {

    const { data } = req.body;
    if(!data) return res.status(404).json({errors: "Please Sign In !!"}); 


    try {

        const { name, email } = data;
        const user = await User.findOne({account: email});

        if(user) {

            const AccessToken = generateAccessToken(user._id);
            const RefreshToken = generateRefreshToken(user._id);

            res.cookie('RefreshToken', RefreshToken, {
                httpOnly: true,
                path: '/api/RefreshToken',
                maxAge: 30*24*60*60*1000
            });

            const userUpdated = await User.findOneAndUpdate({_id: user._id}, {rf_token: RefreshToken});
            if(!userUpdated) return res.status(404).json({errors: "Can't Update User Token !!"});

            return res.json({msg: "SignIn Success !", AccessToken, User: { _id: userUpdated._id, name: userUpdated.name, role: userUpdated.role }});

        }else {

            const password =  `${email} your facebook secret password`;
            const hashedPassword = await bcrypt.hash(password, 12);
            if(!hashedPassword) return res.status(400).json({errors: "Can't hash data !!"});

            const newUser = new User({ name: name, account: email, password: hashedPassword, type: 'facebook' });

            const AccessToken = generateAccessToken(newUser._id);
            const RefreshToken = generateRefreshToken(newUser._id);

            newUser.rf_token = RefreshToken;

            newUser.save()
                    .then(data => {

                        res.cookie('RefreshToken', RefreshToken, {
                            httpOnly: true,
                            path: '/api/RefreshToken',
                            maxAge: 30*24*60*60*1000
                        });

                        return res.json({msg: "SignUp Success, You Are Connected Now !!", AccessToken, User: { _id: data._id, name: data.name, role: data.role }});
                    })
                    .catch(err => res.status(400).json({errors: err}))

        }

    } catch (err) {
        return res.status(500).json({errors: err.message}); 
    }


}

exports.smsSignIn = async (req, res) => {

    const { account } = req.body;
    if(!account) return res.status(400).json({errors: "Please Sign In !!"}); 

    const data = await smsOTP(account, 'sms');
    if(!data) return res.status(400).json({errors: "Can't Send SMS !!"}); 
    res.json({data});

}

exports.smsVerify = async (req, res) => {

    const { account, code } = req.body;

    const data = await smsVerification(account, code);
    if(!data.valid) return res.status(400).json({errors: "Invalid Authentification !!"}); 

    try {
        
        const password =  `${account} your phone secret password`;
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.findOne({account});

        if(user) {

            const AccessToken = generateAccessToken(user._id);
            const RefreshToken = generateRefreshToken(user._id);

            res.cookie('RefreshToken', RefreshToken, {
                httpOnly: true,
                path: '/api/RefreshToken',
                maxAge: 30*24*60*60*1000
            });

            // await User.findOneAndUpdate({_id: user._id}, {rf_token: RefreshToken});

            return res.json({msg: "SignIn Success !", AccessToken, User: { _id: user._id, name: user.name, role: user.role }});

        }else {

            const newUser = new User({ name: name, account: email, password: hashedPassword });

            newUser.save()
                    .then(data => {
                        const AccessToken = generateAccessToken(data._id);
                        const RefreshToken = generateRefreshToken(data._id);
            
                        res.cookie('RefreshToken', RefreshToken, {
                            httpOnly: true,
                            path: '/api/RefreshToken',
                            maxAge: 30*24*60*60*1000
                        });

                        // await User.findOneAndUpdate({_id: data._id}, {rf_token: RefreshToken});

                        return res.json({msg: "SignUp Success, You Are Connected Now !!", AccessToken, User: { _id: data._id , name: data.name }});
                    })
                    .catch(err => res.status(400).json({errors: err}))



        }

    } catch (err) {
        return res.status(500).json({errors: err.message}); 
    }



}

exports.forgotPassword = async (req, res) => {

    try {
        const { account } = req.body;

        const user = await User.findOne({account});
        if(!user) return res.status(400).json({errors: 'User Not Exist.'});
    
        if(user.type !== 'register')
        return res.status(400).json({errors: `Quick login account with ${user.type} can't use this function.`});

        const AccessToken = generateAccessToken(user._id);
        const url = `${process.env.Client_Url}/forgotPassword/${AccessToken}`;
    
        if(validateEmail(account)){
            sendEmail(account, url, 'Reset Your Password');
            return res.json({msg: 'Success !! Please Check Your Email .'});
        }else if(validatePhone(account)){
            // sendSMS(account, url, 'Verify Your Phone Number');
            // return res.json({msg: 'Success !! Please Check Your Phone .'});
        }
    }catch (err){
        return res.status(500).json({errors: err.message});
    }  

}
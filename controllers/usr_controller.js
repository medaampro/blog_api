const User = require("../models/User");

const {generate_active_token, verify_active_token, 
       generate_access_token, verify_access_token, 
       generate_refresh_token, verify_refresh_token}         = require("../helpers/tokens");
const {send_email}                                           = require("../helpers/email");
const {validate_username, validate_email, validate_password} = require("../helpers/validation");

const bcrypt = require("bcrypt");
const {OAuth2Client} = require("google-auth-library");
const client = new OAuth2Client(`${process.env.CLIENT_ID}`);

exports.signup = async (req, res) => 
{
    const {username, email, password} = req.body;

    if(!validate_username(username).status)
        return res.status(400).json({errors: validate_username(username).msg});

    if(!validate_email(email).status)
        return res.status(400).json({errors: validate_email(email).msg});

    if(!validate_password(password).status)
        return res.status(400).json({errors: validate_password(password).msg});

    try 
    {
        const user = await User.findOne({email});
        if(user) return res.status(400).json({errors: "error, please change email !!"});

        const hashed_password = await bcrypt.hash(password, 12);
        if(!hashed_password) return res.status(400).json({errors: "error, please retry !!"});

        const active_token = generate_active_token({username, email, password: hashed_password});
        const url = `${process.env.SERVER_URL}/activate/${active_token}`;

        const result = await send_email(email, url, "verify your email address.");
        res.json({msg: "signup success ! please check your email."});
    }
    catch(err)
    {
        res.status(500).json({errors: err.message});
    }
}

exports.activate_account = async (req, res) => 
{
    try
    {
        const {active_token} = req.params;
        const decoded_active_token = verify_active_token(active_token);

        const user = new User(decoded_active_token.data);
        const result = await user.save();

        res.json({msg: "account activated successfully, welcome !!"})
    }
    catch(err) 
    {
        if(err.code === 11000)
            res.status(400).json({errors: "account already activated !!"});

        else if(err.errors)
            res.status(400).json({errors: err.errors[`${Object.keys(err.errors)[0]}`].message});

        else
            res.status(500).json({errors: "error, invalid token please signup again !!"});
    }
}

exports.signin = async (req, res) => 
{
    try 
    {
        const {email, password} = req.body;

        const user =  await User.findOne({email});
        if(!user) return res.status(404).json({errors: "error, user don't exist !!"});
    
        const compare = await bcrypt.compare(password, user.password);
        if(!compare) return res.status(404).json({errors: "incorrect password."});
    
        const access_token = generate_access_token(user._id);
        const refresh_token = generate_refresh_token(user._id);
    
        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            path: "/api/refresh",
            maxAge: 30*24*60*60*1000
        });
    
        const _user = await User.findOneAndUpdate({_id: user._id}, {refresh_token});
        if(!_user) return res.status(404).json({errors: "error, please retry !!"});
    
        res.json({msg: "signin success !", access_token, user: {_id: _user._id, username: _user.username, role: _user.role}});
    }
    catch(err)
    {
        res.status(500).json({errors: err.message});
    }
}

exports.signout = async (req, res) => 
{
    try
    {
        res.clearCookie("refresh_token", {path: "/api/refresh"});

        const user = await User.findOneAndUpdate({_id: req.user._id}, {refresh_token: ''});
        if(!user) return res.status(404).json({errors: "error, please retry !!"});

        res.json({msg: "signout success !!"});
    }
    catch(err)
    {
        res.status(500).json({errors: err.message});
    }
}

exports.refresh_token_signin = async (req, res) => 
{
    try 
    {
        const refresh_token = req.cookies.refresh_token;
        if(!refresh_token) return res.status(404).json({errors: "please signin !!"});
        
        const decoded_refresh_token = verify_refresh_token(refresh_token);
        if(!decoded_refresh_token) return res.status(404).json({errors: "please signin !!"});
        
        const user = await User.findById(decoded_refresh_token.data).select("-password +refresh_token");
        if(!user) return res.status(404).json({errors: "user don't exist !!"});

        if(user.refresh_token != refresh_token) return res.status(404).json({errors: "please signin !!"});

        const access_token = generate_access_token(user._id);
        const _refresh_token = generate_refresh_token(user._id);
    
        res.cookie("refresh_token", _refresh_token, {
            httpOnly: true,
            path: "/api/refresh",
            maxAge: 30*24*60*60*1000
        });
    
        const _user = await User.findOneAndUpdate({_id: user._id}, {refresh_token: _refresh_token});
        if(!_user) return res.status(404).json({errors: "error, please retry !!"});
    
        return res.json({msg: "signin success !", access_token, user: {_id: _user._id, username: _user.username, role: _user.role}});
    }
    catch(err)
    {
        return res.status(500).json({errors: err.message});
    }
}

exports.google_signin = async (req, res) => 
{
/*
    const {id_token} = req.body;
    if(!id_token) return res.status(404).json({errors: "please signin !!"}); 
*/
    try 
    {
/*
        const verify = await client.verifyIdToken({idToken: id_token, audience: `${process.env.MAIL_CLIENT_ID}`});
        const {name, email, email_verified} = verify.getPayload();
        if(!email_verified) return res.status(500).json({errors: "email verification failed !!"}); 
*/

        const user = await User.findOne({email});

        if(user) 
        {
            const access_token = generate_access_token(user._id);
            const refresh_token = generate_refresh_token(user._id);
        
            res.cookie("refresh_token", refresh_token, {
                httpOnly: true,
                path: "/api/refresh",
                maxAge: 30*24*60*60*1000
            });
        
            const _user = await User.findOneAndUpdate({_id: user._id}, {refresh_token});
            if(!_user) return res.status(404).json({errors: "error, please retry !!"});
        
            return res.json({msg: "signin success !", access_token, user: {_id: _user._id, username: _user.username, role: _user.role}});
        }
        else 
        {
            const password = `${email} your google secret password`;
            const hashed_password = await bcrypt.hash(password, 12);
            if(!hashed_password) return res.status(400).json({errors: "error, please retry !!"});

            const _user = new User({username: name, email, password: hashed_password, type: "google"});

            const access_token = generate_access_token(_user._id);
            const refresh_token = generate_refresh_token(_user._id);

            _user.refresh_token = refresh_token;

            _user.save()
                .then(__user => {
                    res.cookie("refresh_token", refresh_token, {
                        httpOnly: true,
                        path: "/api/refresh",
                        maxAge: 30*24*60*60*1000
                    });

                    res.json({msg: "signup success !", access_token, user: {_id: __user._id, username: __user.username, role: __user.role}});
                })
                .catch(err => res.status(400).json({errors: err}))
        }
    } 
    catch(err) 
    {
        return res.status(500).json({errors: err.message}); 
    }
}

exports.forgot_password = async (req, res) => 
{
    try 
    {
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).json({errors: "user not exist."});

        if(user.type != "register")
            return res.status(400).json({errors: "Quick login account doesn't support this feature."});

        // send access token in query, to be used when reseting password.
        const access_token = generate_access_token(user._id);
        const url_to_reset_page = `goToResetPage?token=${access_token}`;

        const result = await send_email(user.email, url_to_reset_page, "reset your password");
        res.json({msg: "please check your email."});
    }
    catch(err)
    {
        return res.status(500).json({errors: err.message});
    }
}

exports.reset_password = async (req, res) => 
{
    const {password} = req.body;

    if(!validate_password(password).status)
        return res.status(400).json({errors: validate_password(password).msg});

    try 
    {
        const hashed_password = await bcrypt.hash(password, 12);
        if(!hashed_password) return res.status(400).json({errors: "error, please retry !!"});
    
        const user = await User.findOneAndUpdate({_id: req.user._id}, {password: hashed_password});
        if(!user) return res.status(400).json({errors: "error, please retry !!"});

        if(user.type != "register")
            return res.status(400).json({errors: "Quick login account doesn't support this feature."});
    
        res.json({msg: "success, password reseted !"});
    }
    catch(err) 
    {
        res.status(500).json({errors: err.message})
    }
}

exports.get_user = (req, res) => 
{
    res.json({msg: "user retrieved !!", data: req.profile});
}

exports.update_user = async (req, res) => 
{
    if((req.user.role != "admin") && (toString(req.user._id) != toString(req.profile._id)))
        return res.status(400).json({errors: "permission denied."});

    const {username, email} = req.body;

    if(!validate_username(username).status)
        return res.status(400).json({errors: validate_username(username).msg});

    if(!validate_email(email).status)
        return res.status(400).json({errors: validate_email(email).msg});

    try 
    {
        const user = await User.findOneAndUpdate({_id: req.profile._id}, {username, email});
        if(!user) return res.status(400).json({errors: "error, please retry !!"});

        res.json({msg: "success, user updated successfully !"});
    }
    catch(err) 
    {
        res.status(500).json({errors: err.message})
    }
}

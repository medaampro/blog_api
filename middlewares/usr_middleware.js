const User = require("../models/User");
const {verify_access_token} = require("../helpers/tokens");

exports.is_auth = async (req, res, next) => 
{
    try 
    {
        const token = req.header("Authorization");
        if(!token) return res.status(400).json({errors: "invalid authentication."});
    
        const decoded_access_token = verify_access_token(token);
        if(!decoded_access_token) return res.status(400).json({errors: "invalid authentication."});

        const user = await User.findOne({_id: decoded_access_token.data}).select("-password");
        if(!user) return res.status(400).json({errors: "invalid authentication."});

        req.user = user;
        next();
    }
    catch(err) 
    {
        return res.status(500).json({errors: err.message});
    }
}

exports.profile_by_id = (req, res, next, uid) => 
{
    User.findById(uid)
        .select({password: 0})
        .then(user => {
            if(!user) return res.status(404).json({errors: "user not founded !!"});
            req.profile = user;
            next();
        })
        .catch(err => res.status(400).json({errors: err}))
}

exports.is_admin = (req, res, next) => 
{
    if(!req.user || req.user.role != "admin")
        return res.status(400).json({errors: "access denied."});

    next();
}

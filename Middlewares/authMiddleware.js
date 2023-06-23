const User = require("../Models/User");
const { verifyAccessToken } = require("../Helpers/Tokens");


exports.isAuth = async (req, res, next) => {

    try {

        const token = req.header("Authorization");
        if(!token) return res.status(400).json({errors: "Invalid Authentication."});
    
        const decodedAccessToken = verifyAccessToken(token);
        if(!decodedAccessToken) return res.status(400).json({errors: "Invalid Authentication."});
    
        const user = await User.findOne({_id: decodedAccessToken.data}).select("-password");
        if(!user) return res.status(400).json({errors: "Invalid Authentication."});

        req.user = user;
        next();

    }catch(err) {
        return res.status(500).json({errors: err.message});
    }

}
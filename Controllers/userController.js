const User = require("../Models/User");
const bcrypt = require('bcrypt');

exports.updateUser = (req, res) => {
    
    const user = req.user;
    if(!user) return res.status(400).json({errors: "Invalid Authentication."});

    res.send({msg: "User Updated Successfully"});

    /* 
        Add Attribute Type Of Login To DB : register , sms , google , facebook 
        if user are logged with a Quick Login then disable HTML form to reset Password and Email 
        Client can change HTML in the Page and Try to reset Password So in the Server if user.type !== "register" return ...
    */

}

exports.getUser = (req, res) => {
    
    let id = req.params.id;
    if(!id) return res.status(400).json({errors: "Invalid Search."});

    User.findById(id)
        .select({password: 0})
        .then(user => {
            if(!user) return res.status(404).json({errors: "User Not Founded !!"});
            res.json({msg: "User Retrieved !!", data: user});
        })
        .catch(err => res.status(400).json({errors: err}))

}

exports.resetPassword = async (req, res) => {

    const user = req.user;
    if(!user) return res.status(400).json({errors: "Invalid Authentication."});

    if(user.type !== "register")
    return res.status(400).json({errors: `Quick login account with ${req.user.type} can't use this function.`});

    try {

        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        if(!hashedPassword) return res.status(400).json({errors: "Can't hash data !!"});
    
        const userUpdated = await User.findOneAndUpdate({_id: user._id}, {password: hashedPassword});
        if(!userUpdated) return res.status(400).json({errors: "Can't Reset Password !!"});
    
        return res.json({msg: "Reset Password Success!"});

    }catch(err) {
        return res.status(500).json({errors: err.message})
    }

}

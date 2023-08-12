const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    username:      {type: String, required: [true, "username is required"], trim: true},
    email:         {type: String, required: [true, "email is required"], trim: true, unique: true},
    password:      {type: String, required: [true, "password is required"]},
    role:          {type: String, default: "user"},     // [admin]
    type:          {type: String, default: "register"}, // [login, google]
    refresh_token: {type: String, select: false}
}, 
{
    timestamps: true 
});

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
{
    blog:    {type: mongoose.Types.ObjectId, ref: "Blog", required: true},  
    user:    {type: mongoose.Types.ObjectId, ref: "User", required: true},
    content: {type: String, required: true},
    replies: [{type: mongoose.Types.ObjectId, ref: "Reply"}]
}, 
{
    timestamps: true
});

module.exports = mongoose.model("Comment", commentSchema); 

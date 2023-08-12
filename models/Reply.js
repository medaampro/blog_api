const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
{
    user:    {type: mongoose.Types.ObjectId, ref: "User", required: true},
    content: {type: String, required: true},
}, 
{
    timestamps: true
});

module.exports = mongoose.model("Reply", replySchema);

const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({

    // Create Comment 
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    blog_id: mongoose.Types.ObjectId,
    blog_user_id: mongoose.Types.ObjectId,
    content: { type: String, required: true },
    // Create Comment With Type Reply 
    comment_root: { type: mongoose.Types.ObjectId, ref: 'comment' },
    reply_user: { type: mongoose.Types.ObjectId, ref: 'user' },
    replyCM: [{ type: mongoose.Types.ObjectId, ref: 'comment' }]

}, { timestamps: true })


module.exports = mongoose.model('Comment', commentSchema);
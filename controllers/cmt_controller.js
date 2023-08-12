const Comment  = require("../models/Comment");
const Reply    = require("../models/Reply");
const mongoose = require("mongoose");

exports.create_comment = async (req, res) => 
{
    try 
    {
        const comment = new Comment({blog: req.params.bid, user: req.user._id, content: req.body.content});
        const result = await comment.save();

        res.json({msg: "comment created successfully."});
    }
    catch(err) 
    {
        if(err.errors)
            res.status(400).json({errors: err.errors[`${Object.keys(err.errors)[0]}`].message}); 

        else
            res.status(500).json({errors: err.msg});
    }
}

exports.reply_to_comment = async (req, res) => 
{
    try 
    {
        const reply = new Reply({user: req.user._id, content: req.body.content});

        const result = await reply.save();
        const _result = await Comment.findOneAndUpdate({_id: req.params.cid}, {$push: {replies: result._id}});

        res.json({msg: "response created successfully."});
    }
    catch(err) 
    {
        if(err.errors)
            res.status(400).json({errors: err.errors[`${Object.keys(err.errors)[0]}`].message}); 

        else
            res.status(500).json({errors: err.msg});
    }
}

exports.get_comments = async (req, res) => 
{
    let pageNum  = Number(req.query.page)  * 1 || 1;
    let pageSize = Number(req.query.limit) * 1 || 4;
    let skip     = (pageNum - 1) * pageSize;

    try
    {
        const count = await Comment.where({"blog": mongoose.Types.ObjectId(req.params.bid)}).countDocuments({}).exec();

        const total = (count % pageSize == 0) ? count/pageSize : Math.floor(count/pageSize) + 1;

        const comments = await Comment
                                      .find({"blog": mongoose.Types.ObjectId(req.params.bid)})
                                      .populate({path: "replies", populate: {path: "user", select: {"username": 1}} }) 
                                      .populate("user", {"username": 1})
                                      .select("-blog")
                                      .sort({createdAt: 1})
                                      .skip(skip)
                                      .limit(pageSize)

        res.json({msg: "comments retrieved !!", data: {comments, total}});
    }
    catch(err)
    {
        res.status(500).json({errors: err.message});
    }
}

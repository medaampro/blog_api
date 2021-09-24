const Comment = require("../Models/Comment");
const mongoose = require("mongoose");
const { io } = require("../index");

const Pagination = req => {
    let page = Number(req.query.page) * 1 || 1;
    let limit = Number(req.query.limit) * 1 || 4;
    let skip = (page - 1) * limit;
  
    return { page, limit, skip };
}

exports.createComment = (req, res) => {
    
    try {

        const user = req.user;
        if(!user) return res.status(400).json({errors: "Invalid Authentication."});

        const { content, blog_id, blog_user_id } = req.body;
        
        const newComment = new Comment({
            user: req.user._id,
            blog_id,
            blog_user_id,
            content
        });

        const data = {
            ...newComment._doc,
            user: req.user,
            createdAt: new Date().toISOString()
        }
        
        io.to(`${blog_id}`).emit('createComment', { Msg: "Comment Added Successfully.", Comment: data  });

        newComment.save()
                  .then(data => res.json({msg: "Comment Added Successfully.", Comment: data}))
                  .catch(err => {
                        let x = Object.keys(err.errors)[0];
                        res.status(400).json({errors: err.errors[`${x}`].message});
                  })

    }catch(err) {
        res.status(500).json({errors: err.msg});
    }

}

exports.getComments = (req, res) => {

    const { limit, skip } = Pagination(req);

    Comment.aggregate([
        {
            $facet: {
                data: [
                    {
                        $match: { 
                            blog_id: mongoose.Types.ObjectId(req.params.blog_id),
                            comment_root: { $exists: false },
                            reply_user: { $exists: false } 
                        }
                    },
                    {
                        $lookup:{
                          from: "users",
                          let: { user_id: "$user" },
                          pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                            { $project: { password: 0 }}
                          ],
                          as: "user"
                        }
                    },
                    { $unwind: "$user" },
                    {
                        $lookup:{
                            from: "comments",
                            let: { cm_id: "$replyCM" },
                            pipeline: [
                            { $match: { $expr: { $in: ["$_id", "$$cm_id"] } } },
                            {
                                $lookup:{
                                    from: "users",
                                    let: { user_id: "$user" },
                                    pipeline: [
                                      { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                                      { $project: { password: 0 }}
                                    ],
                                    as: "user"
                                }
                            },
                            { $unwind: "$user" },
                            {
                                $lookup:{
                                    from: "users",
                                    let: { user_id: "$reply_user" },
                                    pipeline: [
                                      { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                                      { $project: { password: 0 }}
                                    ],
                                    as: "reply_user"
                                }
                            },
                            { $unwind: "$reply_user" }
                        ],
                            as: "replyCM"
                        }
                    },
                    { $sort: { createdAt: 1 } },
                    { $skip: skip },
                    { $limit: limit }
                    
                ],
                total: [
                    { 
                      $match: { 
                        blog_id: mongoose.Types.ObjectId(req.params.blog_id),
                        comment_root: { $exists: false },
                        reply_user: { $exists: false }
                    }
                    },
                    { $count: 'count' }
                ]
            }
        },
        {
            $project: {
                data: 1,
                count: { $arrayElemAt: ["$total.count", 0] }
            }
        }
    ])
        .then(x => {
            data = x[0].data;
            count = x[0].count ? x[0].count : 0;
            
            let total = 0;

            if(count % limit === 0) {
              total = count / limit;
            }else {
              total = Math.floor(count / limit) + 1;
            }

            res.json({msg: "Comments Retrieved !!", data, total});
        })
        .catch(err => res.status(400).json({errors: err}))

}

exports.replyComment = async (req, res) => {

    try {

        const user = req.user;
        if(!user) return res.status(400).json({errors: "Invalid Authentication."});

        const { blog_id, blog_user_id, content, comment_root, reply_user } = req.body;
        
        const newComment = new Comment({
            user: req.user._id,
            blog_id,
            blog_user_id,
            content,
            comment_root, 
            reply_user: reply_user._id
        });


        const data = {
            ...newComment._doc,
            user: req.user,
            reply_user: reply_user,
            createdAt: new Date().toISOString()
        }

        io.to(`${blog_id}`).emit('replyComment', { Msg: "Replied Successfully.", Comment: data });

        await Comment.findOneAndUpdate({_id: comment_root}, { $push: { replyCM: newComment._id } });

        await newComment.save();

        res.json({ msg: "Response Added Successfully.", Comment: newComment });


    }catch(err) {
        res.status(500).json({errors: err.msg});
    }
    
}

// Update b Patch && Delete 
// li Y9dr idr delete lcomment ola l reply ima mol lblog ola mol comment ola reply wa7d f jouj donc 
// let comment = Comment.findOneAndDelete({ _id: req.params._id, $or: [ user: req.user._id, blog_user_id: req.user._id ] })
// if(comment.comment_root) {
    // Comments.findOneAndUpdate({_id: comment_root }, { $pull: { replyCM: comment._id } } )
// }else{
//    Comments.deleteMany({_id: {$in: comment.replyCM }})
// } 
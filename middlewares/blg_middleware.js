const Blog = require("../models/Blog");

exports.blog_by_id = (req, res, next, bid) => 
{
    Blog.findById(bid)
        .then(blog => {
            if(!blog) return res.status(404).json({errors: "blog not founded !!"});
            req.blog = blog;
            next();
        })
        .catch(err => res.status(400).json({errors: err}))
}


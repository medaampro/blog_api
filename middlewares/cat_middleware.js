const Category = require("../models/Category");

exports.category_by_id = (req, res, next, cid) => 
{
    Category.findById(cid)
        .then(category => {
            if(!category) return res.status(404).json({errors: "category not founded !!"});
            req.category = category;
            next();
        })
        .catch(err => res.status(400).json({errors: err}))
}


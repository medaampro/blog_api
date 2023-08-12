const Category = require("../models/Category");
const Blog     = require("../models/Blog");

exports.get_categories = (req, res) => 
{
    Category.find()
            .then(categories => res.json({msg: "categories retrieved !!", data: categories}))
            .catch(err => res.status(400).json({errors: err}))
}

exports.create_category = async (req, res) => 
{
    try 
    {
        const category = new Category({name: req.body.name.toLowerCase()});
        const result = await category.save();

        res.json({msg: "category created successfully."});
    }
    catch(err) 
    {
        if(err.code === 11000)
            res.status(400).json({errors: "category already exist !!!"}); 

        else if(err.errors)
            res.status(400).json({errors: err.errors[`${Object.keys(err.errors)[0]}`].message}); 

        else
            res.status(500).json({errors: err.msg});
    }
}

exports.update_category = async (req, res) => 
{
    try 
    {
        const category = await Category.findOneAndUpdate({_id: req.category._id}, {name: req.body.name.toLowerCase()});
        res.json({msg: "category updated successfully."});
    }
    catch(err) 
    {
        res.status(500).json({errors: err.msg});
    }
}

exports.delete_category = async (req, res) => 
{
    try 
    {
        const blog = await Blog.find({category: req.category._id});
        if(blog.length > 0) return res.status(400).json({errors: "delete attached blogs first."});

        const category = await Category.findByIdAndDelete(req.category._id);
        res.json({msg: "category deleted successfully."});
    }
    catch(err) 
    {
        res.status(500).json({errors: err.msg});
    }
}

const Category = require("../Models/Category");
const Blog = require("../Models/Blog");

exports.createCategory = (req, res) => {
    
    try {

        const name = req.body.name.toLowerCase();
        const user = req.user;
        if(!user) return res.status(400).json({errors: "Invalid Authentication."});
        if(user.role !== 'admin') return res.status(400).json({errors: "Admin Ressources."});
        
        const newCategory = new Category({name});
        newCategory.save()
                   .then(() => res.json({msg: "Category Created Successfully."}))
                   .catch(err => {
                        if(err.code === 11000){
                            res.status(400).json({errors: "Category Already Exist !!!"}); 
                        }else{
                            let x = Object.keys(err.errors)[0];
                            res.status(400).json({errors: err.errors[`${x}`].message}); 
                        }
                   })

    }catch(err) {

        res.status(500).json({errors: err.msg});
    }

}

exports.getCategories = (req, res) => {
    Category.find()
            .then( x => {
                if(x.length === 0) return res.status(404).json({errors: "Categories Not Founded !!"});
                res.json({msg: "Categories Retrieved !!", data: x});
            } )
            .catch(err => res.status(400).json({errors: err}))
}

exports.updateCategory = async (req, res) => {

    const user = req.user;
    if(!user) return res.status(400).json({errors: "Invalid Authentication."});
    if(user.role !== 'admin') return res.status(400).json({errors: "Admin Ressources."});

    try {
        const category = await Category.findOneAndUpdate({ _id: req.params.id }, { name: req.body.name.toLowerCase() });
        res.json({msg: "Category Updated Successfully."});
    }catch(err) {
        res.status(500).json({errors: err.msg});
    }
}

exports.deleteCategory = async (req, res) => {

    const user = req.user;
    if(!user) return res.status(400).json({errors: "Invalid Authentication."});
    if(user.role !== 'admin') return res.status(400).json({errors: "Admin Ressources."});

    try {
        const blog = await Blog.find({category: req.params.id});
        if(blog.length > 0) return res.status(400).json({errors: "Can't delete Category there is a blogs."});

        const category = await Category.findByIdAndDelete(req.params.id);
        res.json({msg: "Category Deleted Successfully."});
    }catch(err) {
        res.status(500).json({errors: err.msg});
    }
}
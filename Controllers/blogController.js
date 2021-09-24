const Blog = require("../Models/Blog");
const mongoose = require("mongoose");

const Pagination = req => {
    let page = Number(req.query.page) * 1 || 1;
    let limit = Number(req.query.limit) * 1 || 4;
    let skip = (page - 1) * limit;
  
    return { page, limit, skip };
}

exports.createBlog = (req, res) => {
    
    try {

        const data = req.body; 
        const user = req.user;
        if(!user) return res.status(400).json({errors: "Invalid Authentication."});
        if(user.role !== 'admin') return res.status(400).json({errors: "Admin Ressources."});
        
        const newBlog = new Blog({...data, user: user._id});
        newBlog.save()
                .then(() => res.json({msg: "Blog Created Successfully."}))
                .catch(err => {
                    if(err.code === 11000){
                        res.status(400).json({errors: "Blog Already Exist !!!"}); 
                    }else{
                        let x = Object.keys(err.errors)[0];
                        res.status(400).json({errors: err.errors[`${x}`].message}); 
                    }
                })

    }catch(err) {
        res.status(500).json({errors: err.msg === "jwt expired" ? "Please Sign Up Again" : err.msg });
    }

}

exports.getBlogs = (req, res) => {

        Blog.aggregate([
            {
                $lookup: {
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
                $lookup: {
                    "from": "categories",
                    "localField": "category",
                    "foreignField": "_id",
                    "as": "category"
                }
            },
            { $unwind: "$category" },
            { $sort: { "createdAt": -1 } },
            {
                $group: {
                  _id: "$category._id",
                  name: { $first: "$category.name" },
                  blogs: { $push: "$$ROOT" },
                  count: { $sum: 1 }
                }
            },
            {
                $project: {
                  blogs: {
                    $slice: ['$blogs', 0, 4]
                  },
                  count: 1,
                  name: 1
                }
            }

        ])
            .then( x => {
                    if(x.length <= 0) return res.status(404).json({errors: "Blogs Not Founded !!"});
                    res.json({msg: "Blogs Retrieved !!", data: x});
                } )
            .catch(err => res.status(400).json({errors: err}))

}

exports.getBlogsByCategoryId = (req, res) => {

    const { limit, skip } = Pagination(req);

    Blog.aggregate([
        {
            $facet: {
                totalData: [
                    {
                        $match: { category: mongoose.Types.ObjectId(req.params.category_id) }
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
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit }
                    
                ],
                totalCount: [
                    { 
                      $match: { 
                        category: mongoose.Types.ObjectId(req.params.category_id) 
                      } 
                    },
                    { $count: 'count' }
                ]
            }
        },
        {
            $project: {
              count: { $arrayElemAt: ["$totalCount.count", 0] },
              totalData: 1
            }
        }
    ])
        .then(x => {
            const blogs = x[0].totalData;
            const count = x[0].count;

            let total = 0;

            if(count % limit === 0) {
              total = count / limit;
            }else {
              total = Math.floor(count / limit) + 1;
            }

            res.json({msg: "Blogs By Category Retrieved !!", data: {blogs, total}});
        })
        .catch(err => res.status(400).json({errors: err}))

}

exports.getBlogsByUserId = (req, res) => {

    const { limit, skip } = Pagination(req);

    Blog.aggregate([
        {
            $facet: {
                totalData: [
                    {
                        $match: { user: mongoose.Types.ObjectId(req.params.user_id) }
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
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit }
                    
                ],
                totalCount: [
                    { 
                      $match: { 
                        user: mongoose.Types.ObjectId(req.params.user_id) 
                      } 
                    },
                    { $count: 'count' }
                ]
            }
        },
        {
            $project: {
              count: { $arrayElemAt: ["$totalCount.count", 0] },
              totalData: 1
            }
        }
    ])
        .then(x => {
            const blogs = x[0].totalData;
            const count = x[0].count;

            let total = 0;

            if(count % limit === 0) {
              total = count / limit;
            }else {
              total = Math.floor(count / limit) + 1;
            }

            res.json({msg: "Blogs By User Retrieved !!", data: {blogs, total}});
        })
        .catch(err => res.status(400).json({errors: err}))

}

exports.getBlog = (req, res) => {
  Blog.findById(req.params.blog_id)
      .populate('user', '-password')
      .then( x => {
          if(!x) return res.status(404).json({errors: "Blog Not Founded !!"});
          res.json({msg: "Blog Retrieved !!", data: x});
      } )
      .catch(err => res.status(400).json({errors: err}))
}

exports.searchBlog = async (req, res) => {

  try {
    const blogs = await Blog.aggregate([
      {
        $search: {
          index: "searchBlog",
          autocomplete: {
            "query": `${req.query.title}`,
            "path": "title"
          }
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 5},
      {
        $project: {
          title: 1,
          description: 1,
          thumbnail: 1,
          createdAt: 1
        }
      }
    ])

    if(blogs.length === 0)
      return res.status(400).json({errors: 'No Blogs.'});

    res.json({msg: "Blog Retrieved !!", data: blogs});

  } catch (err) {
      return res.status(500).json({errors: err.message});
  }

}

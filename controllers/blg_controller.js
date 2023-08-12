const Blog = require("../models/Blog");
const mongoose = require("mongoose");

exports.create_blog = async (req, res) => 
{
    try 
    {
        const blog = new Blog({...req.body, user: req.user._id});
        const result = await blog.save();

        res.json({msg: "blog created successfully."});
    }
    catch(err) 
    {
        if(err.code === 11000)
            res.status(400).json({errors: "blog already exist !!!"}); 

        else if(err.errors)
            res.status(400).json({errors: err.errors[`${Object.keys(err.errors)[0]}`].message}); 

        else
            res.status(500).json({errors: err.msg});
    }
}

exports.get_blog = (req, res) => 
{
    res.json({msg: "blog retrieved !!", data: req.blog});
}

exports.get_blogs = (req, res) => 
{
    Blog.aggregate(
    [
        {$lookup:  {from: "users", localField: "user", foreignField: "_id", as: "user"}},
        {$unwind:  "$user"},
        {$lookup:  {from: "categories", localField: "category", foreignField: "_id", as: "category"}},
        {$unwind:  "$category"},
        {$sort:    {"createdAt": -1}},
        {$group:   {_id: "$category._id", name: {$first: "$category.name"}, blogs: {$push: "$$ROOT"}, count: {$sum: 1}}},
        {$project: {blogs: {$slice: ["$blogs", 0, 4]}, count: 1, name:  1}}
    ])
        .then(blgs => res.json({msg: "blogs retrieved !!", data: blgs}))
        .catch(err => res.status(500).json({errors: err}))
}

exports.get_blogs_by_category_id = (req, res) => 
{
    let pageNum  = Number(req.query.page)  * 1 || 1;
    let pageSize = Number(req.query.limit) * 1 || 4;
    let skip     = (pageNum - 1) * pageSize;

    Blog.aggregate(
    [
        {
            $facet:
            {
                records:
                [
                    {$match:  {category: mongoose.Types.ObjectId(req.params.cid)}},
                    {$lookup: {from: "users", localField: "user", foreignField: "_id", as: "user"}},
                    {$unwind: "$user"},
                    {$sort:   {createdAt: -1}},
                    {$skip:   skip},
                    {$limit:  pageSize}
                ],
                _count:
                [
                    {$match:  {category: mongoose.Types.ObjectId(req.params.cid)}},
                    {$count:  "count"}
                ]
            }
        },
        {$project: {count: {$arrayElemAt: ["$_count.count", 0]}, records: 1}}
    ])

        .then(result => 
        {
            const blogs = result[0].records;
            const count = result[0].count;

            let total = (count % pageSize == 0) ? count/pageSize : Math.floor(count/pageSize) + 1;

            res.json({msg: "blogs by category retrieved !!", data: {blogs, total}});
        })
        .catch(err => res.status(500).json({errors: err}))
}

exports.get_blogs_by_user_id = (req, res) => 
{
    let pageNum  = Number(req.query.page)  * 1 || 1;
    let pageSize = Number(req.query.limit) * 1 || 4;
    let skip     = (pageNum - 1) * pageSize;

    Blog.aggregate(
    [
        {
            $facet:
            {
                records:
                [
                    {$match:  {user: mongoose.Types.ObjectId(req.params.uid)}},
                    {$lookup: {from: "users", localField: "user", foreignField: "_id", as: "user"}},
                    {$unwind: "$user"},
                    {$sort:   {createdAt: -1}},
                    {$skip:   skip},
                    {$limit:  pageSize}
                ],
                _count:
                [
                    {$match:  {user: mongoose.Types.ObjectId(req.params.uid)}},
                    {$count:  "count"}
                ]
            }
        },
        {$project: {count: {$arrayElemAt: ["$_count.count", 0]}, records: 1}}
    ])

        .then(result => 
        {
            const blogs = result[0].records;
            const count = result[0].count;

            let total = (count % pageSize == 0) ? count/pageSize : Math.floor(count/pageSize) + 1;

            res.json({msg: "blogs by user retrieved !!", data: {blogs, total}});
        })
        .catch(err => res.status(500).json({errors: err}))
}

exports.search_blog = async (req, res) => 
{
    Blog.find({$text: {$search: req.query.title}})
        .populate("user", "-password") 
        .select({title: 1, description: 1, thumbnail: 1, createdAt: 1})
        .sort({createdAt: -1})
        .limit(5)
        .then(blogs => res.json({msg: "blog retrieved !!", data: blogs}))
        .catch(err => res.status(500).json({errors: err.message}))
}

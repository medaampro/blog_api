const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
{
    user:        {type: mongoose.Types.ObjectId, ref: "User"},
    category:    {type: mongoose.Types.ObjectId, ref: "Category"},
    title:       {type: String, require: true, trim: true, unique: true, minLength: 10, maxLength: 50},
    content:     {type: String, require: true, minLength: 200},
    description: {type: String, require: true, trim: true, minLength: 20, maxLength: 200},
    thumbnail:   {type: String, require: true}
}, 
{
    timestamps: true
});

blogSchema.index({name: "text", "title": "text"});

module.exports = mongoose.model("Blog", blogSchema);

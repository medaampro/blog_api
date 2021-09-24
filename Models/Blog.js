const mongoose = require('mongoose');


const blogSchema = new mongoose.Schema({

    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    title: { type: String, require: true, trim: true, unique: true, minLength: 10, maxLength: 50 },
    content: { type: String, require: true, minLength: 2000 },
    description: { type: String, require: true, trim: true, minLength: 50, maxLength: 200 },
    thumbnail: { type: String, require: true },
    category: { type: mongoose.Types.ObjectId, ref: 'Category' }

}, { timestamps: true })


module.exports = mongoose.model('Blog', blogSchema);
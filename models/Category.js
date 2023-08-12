const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
{
    name: {type: String, required: [true, "name is required"], trim: true, unique: true, maxLength: [50, "max 50 chars"]}
}, 
{
    timestamps: true 
}); 

module.exports = mongoose.model("Category", categorySchema);

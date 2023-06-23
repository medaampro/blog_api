const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

    name: {type: String, required: [true, 'Please add your name'], trim: true},
    account: {type: String, required: [true, 'Please add your email or phone'], trim: true, unique: true},
    password: {type: String, required: [true, 'Please add your password']},
    role: {type: String, default: "user"}, //admin
    type: {type: String, default: "register"}, //login , sms , google , facebook
    rf_token: {type: String, select: false}

}, { timestamps: true })


module.exports = mongoose.model('User', userSchema);
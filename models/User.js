const mongoose = require('mongoose')
const { Schema } = mongoose;
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    passward: {
        type: String,
        required: true
    },
    date: { type: Date, default: Date.now },
});
const User = mongoose.model('Users', UserSchema)
module.exports = User;
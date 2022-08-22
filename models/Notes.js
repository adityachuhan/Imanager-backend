const mongoose = require('mongoose')
const { Schema } = mongoose;
const NotesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        default: 'General'
    },
    date: { type: Date, default: Date.now },
});

const Notes = mongoose.model('Notes', NotesSchema)
module.exports = Notes;
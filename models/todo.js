const mongoose = require('mongoose')
const { Schema } = mongoose;
const NotesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    work: {
        type: String,
        required: true
    },
    state: {
        type: String,
        default: "Not started"
    },
    date: { type: Date },
});

const Todo = mongoose.model('Todo', NotesSchema)
module.exports = Todo;
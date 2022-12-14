const mongoose = require('mongoose')
const { Schema } = mongoose;
const DiarySchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    diaryNote: {
        type: String,
        required: true
    },
    date: { type: Date, default: Date.now },
});

const Diary = mongoose.model('Diarynote', DiarySchema)
module.exports = Diary;
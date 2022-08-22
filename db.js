const { default: mongoose } = require("mongoose");

const mongoURI = 'mongodb://localhost:27017/inotebook';
const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log('This shit is ready and connectesd sucessfully');
    })
}

module.exports = connectToMongo;
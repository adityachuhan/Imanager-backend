require('dotenv').config()
const { default: mongoose } = require("mongoose");
mongoose.set('strictQuery', true);
const mongoURI = process.env.MONGOURI;
// const mongoURI = 'mongodb://localhost:27017/i-manager';
const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log('Connected sucessfully to Database');
    })
}

module.exports = connectToMongo;
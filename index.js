const express = require('express');
const connectToMongo = require('./db');
var cors = require('cors')

connectToMongo();
const app = express();
const port = 5000;

app.use(cors())
app.use(express.json());

//Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/todo'))
app.use('/api/diary', require('./routes/diary'))
app.use('/api/file', require('./models/File'))

app.listen(port, () => {
    console.log(`Api listening on port ${port}`)
})
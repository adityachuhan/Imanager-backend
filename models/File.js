require('dotenv').config()
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const fetchuser = require('../midleware/fetchuser')
const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectId;
// mongo URI
const mongoURI = process.env.MONGOURI;
// CREATE mongo connection 
const conection = mongoose.createConnection(mongoURI);
let gfs;
conection.once('open', () => {
    //Init Stream
    gridfsBucket = new mongoose.mongo.GridFSBucket(conection.db, {
        bucketName: 'Notes'
    })
    gfs = Grid(conection.db, mongoose.mongo);
    gfs.collection('Notes');
})

// create storage engine for image
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            if ((file.mimetype === 'application/zip') || (file.mimetype === 'application/pdf')) {
                fileInfo = {
                    bucketName: 'Notes',
                    filename: file.originalname,
                    // metadata: { title: "this is the best", user: req.user.id }
                    metadata: req.user.id
                };
                resolve(fileInfo)
            } else {
                reject('Please Choose a correct file');
            }
        })
    }

});
const Upload = multer({ storage });
//ROUTE: Adding pdf or zip file to mongondb using gridfs to :POST at '/api/file/addfile'  login required
const fetchuser2 = require('../midleware/fetchuserfromurl')
router.post(('/addfile/:token'), fetchuser2, Upload.single('file'), (req, res) => {
    res.redirect('https://imanager.onrender.com/Notes-files')
})


//ROUTE:2 Getting details of  files of the user has stores in the to :GET at '/api/file/files'  login required
router.get(('/filesinfo'), fetchuser, (req, res) => {
    gfs.files.find({ metadata: req.user.id }).toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.json([]);
        }
        return res.json(files);
    })
})

//ROUTE:3 Getting file of the user using the file name :GET at '/api/file/fileview/:filename'  login required
router.get('/fileview/:filename', (req, res) => {
    const file = gfs.files.find({
        filename: req.params.filename,
    }).toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        gridfsBucket.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});

router.delete("/filedelete/:id", fetchuser, (req, res) => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conection.db, {
        bucketName: 'Notes'
    })
    res.status(200)
    gridfsBucket.delete(ObjectID(req.params.id));
    
});
module.exports = router;

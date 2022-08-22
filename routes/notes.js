const express = require('express');
const router = express.Router();
const fetchuser = require('../midleware/fetchuser')
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');

//ROUTE:1 Getting All the NOtes: GET at '/api/notes/fetchallnotes'  and  login required
router.get('/fetchallnotes', fetchuser, async(req, res) => {
        try {
            const notes = await Notes.find({ id: req.user.id })
            res.send(notes);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal servor errror");
        }
    })
    //ROUTE:2 Adding notes: POST at '/api/notes/addnotes'  and  login required
router.post('/addnotes', fetchuser, [
        body('title', 'Title must be of atleast of 3 characters').isLength({ min: 3 }),
        body('description', 'Description must be of atleast of 5 characters').isLength({ min: 5 }),
    ], async(req, res) => {
        try {
            // if there are errors , return bad request and errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { title, tag, description } = req.body;
            const note = new Notes({
                tag,
                title,
                description,
                user: req.user.id
            })
            const savednote = await note.save();

            res.send(savednote);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal servor errror");
        }
    })
    //ROUTE 3: Updating existing notes: PUT at '/api/notes/updatenote/:id'  and  login required
router.put('/updatenote/:id', fetchuser, async(req, res) => {
        try {
            const { title, tag, description } = req.body;
            // creating a new note object
            const newnote = {};
            if (title) { newnote.title = title };
            if (tag) { newnote.tag = tag };
            if (description) { newnote.description = description };

            let note = await Notes.findById(req.params.id)
            if (!note) { return res.status(404).send('Not found') };

            if (req.user.id !== note.user.toString()) {
                return res.status(404).send('Not found')
            }

            note = await Notes.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true });
            res.send(newnote);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal servor errror");
        }
    })
    //ROUTE 4: Deleting existing notes: DELETE at '/api/notes/deleteenote/:id'  and  login required
router.delete('/deletenote/:id', fetchuser, async(req, res) => {
    try {

        let note = await Notes.findById(req.params.id)
        if (!note) { return res.status(404).send('Not found') };

        if (req.user.id !== note.user.toString()) {
            return res.status(404).send('Not found')
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.send('Note has been deleted sucessfully');
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal servor errror");
    }
})

module.exports = router
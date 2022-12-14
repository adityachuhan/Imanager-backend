const express = require('express');
const router = express.Router();
const fetchuser = require('../midleware/fetchuser')
const Diary = require('../models/Diary')
const { body, validationResult } = require('express-validator');

// Adding the diary note to the database at post at '/api/diary/addDiary' (login required)
router.post('/addDiary', fetchuser, [
    body('DiaryNote', 'must be of atleast of 30 characters').isLength({ min: 30 }),
], async(req, res) => {

    try {
        const { diaryNote } = req.body;
        const daryNote = new Diary({
            diaryNote,
            user: req.user.id
        })
        const savediarynote = await daryNote.save()
        res.send(savediarynote);

    } catch (error) {
        res.status(500).send("Internal Servor error");
        console.log(error.message);
    }
})

// updating the diary note to the database at post at '/api/diary/updateDiary/:id' (login required)
router.put('/updateDiary/:id', fetchuser, [
        body('diaryNote', 'must be of atleast of 30 characters').isLength({ min: 30 }),
    ], async(req, res) => {

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const userid = req.user.id;
            const savedNote = await Diary.findById(req.params.id);
            if (!savedNote) {
                return res.status(404).send('Not found')
            }
            if (savedNote.user != userid) {
                return res.status(404).send('Not found and its not yours')
            }
            const updatedNote = await Diary.findByIdAndUpdate(req.params.id, {
                user: userid,
                diaryNote: req.body.diaryNote
            })
            res.status(200).send(updatedNote);

        } catch (error) {
            res.status(500).send("Internal Servor error");
            console.log(error.message);
        }
    })
    // Deleting the diary note to the database at post at '/api/diary/deleteDiary/:id' (login required)
router.delete('/deleteDiary/:id', fetchuser, async(req, res) => {

        try {

            const userid = req.user.id;
            const savedNote = await Diary.findById(req.params.id);
            if (!savedNote) {
                return res.status(404).send('Not found')
            }
            if (savedNote.user != userid) {
                return res.status(404).send('Not found and its not yours')
            }
            const deleteResponse = await Diary.findByIdAndDelete(req.params.id)
            res.status(200).send('Your Diary Note has been delete sucessfully');

        } catch (error) {
            res.status(500).send("Internal Servor error");
            console.log(error.message);
        }
    })
    // Fetching all the diary note to the database at post at '/api/diary/fetchDiary' (login required)
router.get('/fetchDiary', fetchuser, async(req, res) => {

    try {
        const data = await Diary.find({ user: req.user.id })
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send("Internal Servor error");
        console.log(error.message);
    }
})

module.exports = router
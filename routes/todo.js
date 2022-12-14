const express = require('express');
const router = express.Router();
const fetchuser = require('../midleware/fetchuser')
const Todo = require('../models/todo')
const { body, validationResult } = require('express-validator');

//ROUTE:1 Getting All the Todo: GET at '/api/notes/fetchalltodos'  and  login required
router.get('/fetchalltodos', fetchuser, async(req, res) => {
        try {
            const todos = await Todo.find({ user: req.user.id })
            res.send(todos);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal servor errror");
        }
    })
    //ROUTE:2 Adding todos: POST at '/api/notes/addtodos'  and  login required
router.post('/addtodo', fetchuser, [], async(req, res) => {
        try {
            // if there are errors , return bad request and errors
            const { work, date } = req.body;
            const todo = new Todo({
                work,
                date,
                user: req.user.id
            })
            const savedtodo = await todo.save();

            res.send(savedtodo);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal servor errror");
        }
    })
    //ROUTE 3: Updating existing todos: PUT at '/api/notes/updatetodatedo/:id'  and  login required
router.put('/updatetodo/:id', fetchuser, async(req, res) => {
        try {
            const { work, date, state } = req.body;
            // creating a new note object
            const newtodo = {};
            if (state) { newtodo.state = state };

            let todo = await Todo.findById(req.params.id)
            if (!todo) { return res.status(404).send('Not found') };

            if (req.user.id !== todo.user.toString()) {
                return res.status(404).send('Not found')
            }

            todo = await Todo.findByIdAndUpdate(req.params.id, { $set: newtodo }, { new: true });
            res.send(newtodo);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal servor errror");
        }
    })
    //ROUTE 4: Deleting existing todo: DELETE at '/api/notes/deleteetodo/:id'  and  login required
router.delete('/deletetodo/:id', fetchuser, async(req, res) => {
    try {

        let todo = await Todo.findById(req.params.id)
        if (!todo) { return res.status(404).send('Not found') };

        if (req.user.id !== todo.user.toString()) {
            return res.status(404).send('Not found')
        }

        todo = await Todo.findByIdAndDelete(req.params.id);
        res.send('Todo has been deleted sucessfully');
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal servor errror");
    }
})

module.exports = router
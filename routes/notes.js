const express = require('express');
const router = express.Router();
const Note = require('../models/Notes');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

router.get('/fetchallnotes', fetchuser, async (req, res) => {


    try {
        const notes = await Note.find({ user: req.user.id });

        res.json(notes);
    } catch (error) {
        console.log(error);
        res.status(500).send("some error occured");
    }

})

router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Enter a valid description').isLength({ min: 5 }),
], async (req, res) => {

    try {
        const { title, tag, description } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, tag, description, user: req.user.id,
        })
        const savedNotes = await note.save();

        res.json(savedNotes)

    } catch (error) {
        console.log(error);
        res.status(500).send("some error occured");
    }

})

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, tag, description } = req.body;
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed");
        }


        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    }  catch (error) {
        console.log(error);
        res.status(500).send("some error occured");
    }

})

router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        const { title, tag, description } = req.body;

        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed");
        }


        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "note has been delted", note: note });
    }  catch (error) {
        console.log(error);
        res.status(500).send("some error occured");
    }

})


module.exports = router;
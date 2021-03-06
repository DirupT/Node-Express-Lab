// import your node modules
const express = require('express');
const db = require('./data/db.js');
const cors = require('cors');

const server = express();
server.use(express.json());
server.use(cors());
// add your server code starting here

server.post('/api/posts', (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) return res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    db
        .insert({ title, contents })
        .then(posts => res.status(201).json(posts))
        .catch(err => res.status(400).json({ error: "There was an error while saving the post to the database" }));
})

server.get('/', (req, res) => {
    res.send('Home');
})

server.get('/api/posts', (req, res) => {
    db
        .find()
        .then(posts => res.status(200).json(posts))
        .catch(err => res.status(500).json({ error: "The posts information could not be retrieved." }));
})

server.get('/api/posts/:id', (req, res) => {
    db
        .findById(req.params.id)
        .then(post => {
            if (post.length === 0) return res.status(404).json({ message: "The post with the specified ID does not exist." });
            res.status(200).json(post);
        })
        .catch(err => res.status(500).json({ error: "The post information could not be retrieved." }));
})

server.delete('/api/posts/:id', (req, res) => {
    db
        .findById(req.params.id)
        .then(post => {
            if (post.length === 0) return res.status(404).json({ message: "The post with the specified ID does not exist." });
            res.status(200).json(post)
            db
                .remove(req.params.id)
                .then(count => {
                    if (count === 0) return res.status(404).json({ message: "The post with the specified ID does not exist." });
                })
                .catch(err => res.status(500).json({ error: "The post could not be removed" }));
        })
        .catch(err => res.status(500).json({ error: "The post information could not be retrieved." }))

})

server.put('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    const { title, contents } = req.body;
    if (!title || !contents) return res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
    db
        .update(id, { title, contents })
        .then(count => {
            if (count === 0) return res.status(404).json({ message: 'The post with the specified ID does not exist.' });
            db
                .findById(id)
                .then(post => {
                    if (post.length === 0) return res.status(404).json({ message: "The post with the specified ID does not exist." });
                    res.status(200).json(post)
                })
                .catch(err => res.status(500).json({ error: "The post information could not be retrieved." }));
        })
        .catch(err => res.status(500).json({ error: "The post information could not be modified." }));
})

server.listen(8000, () => console.log('API is running...'));

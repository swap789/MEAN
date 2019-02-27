const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./model/post');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://Swapnil:9ivsuepEmov9db8n@cluster0-dqrjx.mongodb.net/ndoe-angular?retryWrites=true')
    .then(() => {
        console.log('connected to database');
    }).catch(() => {
        console.log('connection Failed');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers',
        "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save();
    res.status(201).json({
        message: "Post added successfully",
        post: post
    })
});

app.get('/api/posts', (req, res, next) => {

    Post.find().then((documents) => {
        res.status(202).json({
            message: "get post success",
            posts: documents
        })
    })
});

app.delete('/api/posts/:id', (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
        console.log(req.params.id);
        res.status(200).json({ message: "Post deleted", id: req.params.id });
    });
})

module.exports = app;
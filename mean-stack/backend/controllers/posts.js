const express = require("express");
const Post = require("../model/post");

exports.createPost = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(createdPost => {
        // craeted post comes from DB aftre saving
        res.status(201).json({
            message: "Post added successfully",
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath,
                creator: createdPost.creator
            }
        });
    });
}

exports.getPostById = (req, res, next) => {
    Post.findById(req.params.id).then(posts => {
        //send post list came from DB.
        if (posts) {
            res.status(200).json(posts);
        } else {
            res.status(404).json({ message: "Post not Found" });
        }
    });
}

exports.getPosts = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(createdPost => {
        // craeted post comes from DB aftre saving
        res.status(201).json({
            message: "Post added successfully",
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath,
                creator: createdPost.creator
            }
        });
    });
}

exports.updatePostById = (req, res, next) => {
    let imagePath = req.body.imagePath; // if existing imgage used for updation
    if (req.file) {
        // if new image for updation.
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });

    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                message: "updated succesfully",
                posts: result
            });
        } else {
            res.status(401).json({
                message: "Unauthorized",
            });
        }
    });
}

exports.getPostsPagination = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchPosts;

    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    postQuery
        .then(documents => {
            fetchPosts = documents;
            return Post.count();
        })
        .then(count => {
            res.status(202).json({
                message: "get posts success",
                posts: fetchPosts,
                maxPosts: count
            });
        });
}

exports.deletePostsById = (req, res, next) => {
    // delete post using new Id.
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
        if (result.n > 0) {
            res.status(200).json({
                message: "Post deleted",
            });
        } else {
            res.status(401).json({
                message: "Unauthorized",
            });
        }
    });
}
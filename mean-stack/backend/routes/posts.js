const express = require("express");
const Post = require("../model/post");
const router = express.Router();
const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg"
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime Type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");

    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "_" + Date.now() + "." + ext);
  }
});

router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename
    });
    post.save().then(createdPost => {
      // craeted post comes from DB aftre saving
      res.status(201).json({
        message: "Post added successfully",
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath
        }
      });
    });
  }
);

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(posts => {
    //send post list came from DB.
    if (post) {
      res.status(200).json(posts);
    } else {
      res.status(404).json({ message: "Post not Found" });
    }
  });
});

router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
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
      imagePath: imagePath
    });

    Post.updateOne({ _id: req.params.id }, post).then(result => {
      // updated new image
      res.status(200).json({
        message: "updated succesfully",
        posts: result
      });
    });
  }
);

router.get("", (req, res, next) => {
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
});

router.delete("/:id", (req, res, next) => {
  // delete post using new Id.
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(req.params.id);
    res.status(200).json({ message: "Post deleted", id: req.params.id });
  });
});

module.exports = router;

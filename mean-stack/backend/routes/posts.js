const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const postController = require("../controllers/posts");


router.post("", checkAuth, extractFile, postController.getPosts);

router.put("/:id", checkAuth, extractFile, postController.updatePostById);

router.get("/:id", postController.getPostById);

router.get("", postController.getPostsPagination);

router.delete("/:id", checkAuth, postController.deletePostsById);

module.exports = router;

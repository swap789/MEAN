const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

router.post('/signup', userController.createUser);
router.post('/login', userController.login);

module.exports = router;
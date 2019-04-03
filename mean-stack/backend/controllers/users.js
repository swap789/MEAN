const express = require("express");
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'User created',
                        result: result
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                })
        })
}

exports.login = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email }).then(user => {
        console.log(user);
        if (!user) {
            return res.status(401).json({
                message: "Auth Failed"
            })
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
        if (!result) {
            return res.status(401).json({
                message: "Auth Failed"
            })
        }
        console.log(result);
        const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, "secret_should_be_longer",
            { expiresIn: "1h" });
        console.log(token);
        return res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
        })
    }).catch(err => {
        console.log(err);
        return res.status(401).json({
            message: "Auth Failed"
        })
    })

}
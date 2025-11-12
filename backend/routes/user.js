const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../model/UserModel.js"); 



// TODO: localhost - zamienic na baze lokalną
mongoose.connect("mongodb://localhost:27017/BiteBack");


const router = express.Router();

router.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, 15).then(hashed => {
        const newUser = new User({
            username: req.body.username,
            password: hashed,
            email: req.body.email
        })
        newUser.save().then(result => {
            res.status(201).json({
                message: "Registered user " + result.username + " successfully!",
            })
        }).catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

router.post("/login", (req, res) => {
    console.log(process.env.JWT_SECRET)
    User.findOne({username: req.body.username}).then(doc => {
        if (doc == null) {
            return res.status(401).json({
                error: {
                    message: "Unauthorized."
                }
            })
        }
        bcrypt.compare(req.body.password, doc.password, (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: err
                })
            }
            if (result) {
                const token = jwt.sign({_id: doc._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
                res.status(200).json({
                    message: `Logged in, welcome back, ${doc.username}`,
                    token: token,
                    expiresIn: "7 days",                    
                })
            } else {
                return res.status(401).json({
                    error: {
                        message: "Unauthorized."
                    }
                })
            }
        })
    }).catch(err => {
        return res.status(500).json({
            error: {
                message: err
            }
        })
    })
})

module.exports = router
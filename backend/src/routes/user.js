const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../model/UserModel.js"); 

mongoose.connect(process.env.MONGO_URI);
const router = express.Router();

const JWT_EXPIRATION_TIME = "7d"

// potencjalnie email do uzytkownika
router.post("/register", (req, res) => {
    console.log("register")
    bcrypt.hash(req.body.password, 15).then(hashed => {
        const newUser = new User({
            username: req.body.username,
            password: hashed,
            email: req.body.email,
            lang: req.body.lang || "pl",
            fridge: [],
            bitescore: 0
        })
        newUser.save().then(result => {
            res.status(201).json({
                message: "Registered user " + result.username + " successfully!",
                id: result._id
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
    User.findOne({username: req.body.username}).then(user => {
        // brak autoryzacji (nie ma takiego uzytkownika)
        if (user == null) {
            return res.status(401).json({
                error: {
                    message: "Unauthorized."
                }
            })
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            // Błąd po stronie servera (bcrypt)
            if (err) {
                return res.status(500).json({
                    error: err
                })
            }
            // sukces
            if (result) {
                const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: JWT_EXPIRATION_TIME});
                res.status(200).json({
                    token: token,
                    expiresIn: JWT_EXPIRATION_TIME,                    
                })
            } else {
                // brak autoryzacji (niepoprawne hasło)
                return res.status(401).json({
                    error: {
                        message: "Unauthorized."
                    }
                })
            }
        })
    }).catch(err => {
        return res.status(500).json({
            error: err
        })
    })
})

// powinna byc jako middleware funkcja a nie endpoint?
router.get("/auth", (req, res) => {
    try {
        // req.headers.authorization[0] = "Bearer"
        const token = req.headers.authorization.split(" ")[1] 
        decoded = jwt.verify(token, process.env.JWT_SECRET)
        res.status(200).json({
            message: "Authorized",
            userId: decoded._id
        })
    } catch(err) {
        console.log(err)
        res.status(401).json({
            error: {
                message: "Invalid or expired token!"
            }
        })
    }
})

module.exports = router
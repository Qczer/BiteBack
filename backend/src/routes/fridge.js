const mongoose = require("mongoose")
const express = require("express");
const Food = require("../model/Food.js");
const User = require("../model/UserModel.js"); 

const serverError = (err, res) => {
    res.status(500).json({
        error: err
    })
}

// GET (all items), POST (Add to fridge), PATCH (item), DELETE (item) 
mongoose.connect(process.env.MONGO_URI);
const router = express.Router();


router.get("/:userID", (req, res) => {
    User.findOne({_id: req.params.userID}).populate("fridge").then(user => {
        if (user == null) {
            res.status(404).json({
                error: {
                    message: `No user found with given ID: ${req.params.userID}` 
                }
            })
        }
        res.status(200).json({
            fridgeItemsCount: user.fridge.length, 
            fridge: user.fridge
        })
    }).catch(err => serverError(err, res))
})

router.post("/:userID", (req, res) => {
    User.findOne({_id: req.params.userID}).then(user => {
        if (user == null) {
            res.status(404).json({
                error: {
                    message: `No user found with given ID: ${req.params.userID}` 
                }
            })
        }
        const {name, amount, unit, category, iconUrl, expDate} = req.body;
        new Food({
            name: name,
            amount: amount,
            unit: unit,
            category: category,
            iconUrl: iconUrl,
            expDate: new Date(expDate)
        }).save().then(food => {
            user.fridge.push(food._id)
            user.save().then(_ => {
                res.status(201).json({
                    message: `${name} has beed added to ${user.username} fridge!` 
                })
            }).catch(err => serverError(err, res))
        }).catch(err => serverError(err, res))
    }).catch(err => serverError(err, res))
})

router.patch("/:userID", (req, res) => {
    
})

router.delete("/:userID", (req, res) => {

})



module.exports = router
const mongoose = require("mongoose")
const express = require("express");
const Food = require("../model/Food.js");
const User = require("../model/UserModel.js"); 

const serverError = (err, res) => {
    console.log(err)
    res.status(500).json({
        error: err
    })
}

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
            return
        }
        res.status(200).json({
            fridgeItemsCount: user.fridge.length, 
            fridge: user.fridge
        })
    }).catch(err => serverError(err, res))
})
/* PRZYKLADOWY REQUEST BODY:
{
    "name": "Banan", 
    "amount": 5, 
    "unit": "g", 
    "category": "fruit", 
    "iconUrl": "banan.png",
    "expDate": "2025-11-30"
}
*/
router.post("/:userID", (req, res) => {
    User.findOne({_id: req.params.userID}).then(user => {
        if (user == null) {
            res.status(404).json({
                error: {
                    message: `No user found with given ID: ${req.params.userID}` 
                }
            })
            return
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

/* PRZYKLADOWY REQUEST BODY:
{
    "id": "691f9c659c29f4295c5fcbcf",
    "params": [
        {
            "name": "name",
            "value": "apple"
        }
    ]
}
*/
router.patch("/:userID", (req, res) => {
    User.findOne({_id: req.params.userID}).populate("fridge").then(user => {
        if (user == null) {
            res.status(404).json({
                error: {
                    code: 0, // brak takiego uzytkownika
                    message: `No user found with given ID: ${req.params.userID}` 
                }
            })
            return;
        }

        const food = user.fridge.find(food => food._id.toString() == req.body.id);
        if (food == null) {
            res.status(404).json({
                error: {
                    code: 1, // brak takiego jedzenia
                    message: "No food found with provided ID for that user"
                }
            })
            return;
        }
        req.body.params.forEach(param => {
            food[param.name] = param.value
        });
        food.save()

        res.status(200).json({
            message: "Food has been updated successfully",
            updatedFood: food
        });
    }).catch(err => serverError(err, res))
})

/* PRZYKLADOWY REQUEST BODY:
{
    "id": "691f9c659c29f4295c5fcbcf",
}
*/
router.delete("/:userID", (req, res) => {
    User.findOne({_id: req.params.userID}).populate("fridge").then(user => {
        if (user == null) {
            res.status(404).json({
                error: {
                    message: `No user found with given ID: ${req.params.userID}` 
                }
            })
        }

        const food = user.fridge.find(food => food._id.toString() == req.body.id);
        if (food == null) {
            res.status(404).json({
                error: {
                    code: 1, // brak takiego jedzenia
                    message: "No food found with provided ID for that user"
                }
            })
            return;
        }
        user.fridge.remove(food)
        user.save()

        res.status(200).json({
            message: "Food has been deleted successfully",
        });
    }).catch(err => serverError(err, res))
})



module.exports = router
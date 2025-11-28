import express from "express"

import Food from "../model/Food.js"
import User from "../model/User.js"
import {serverError} from "../utils.js";
import { authenticateToken, ensureCorrectUser } from "../middleware/auth.js";

const router = express.Router();

// Routes
router.get("/:userID", authenticateToken, ensureCorrectUser, async (req, res) => {
    try {
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
        })
    }
    catch (err) {
        serverError(err, res)
    }
})

router.post("/:userID", authenticateToken, ensureCorrectUser, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.userID});
        if (!user) {
            return res.status(404).json({
                error: { message: `No user found with given ID: ${req.params.userID}` }
            });
        }

        const foodItems = req.body.map(item => ({
            ...item,
            expDate: new Date(item.expDate)
        }));

        const savedFoods = await Food.insertMany(foodItems);
        
        user.fridge.push(...savedFoods.map(f => f._id));
        user.bitescore += 5;
        await user.save();

        res.status(201).json({
            message: `${savedFoods.length} items have been added to ${user.username} fridge!`
        });
    }
    catch (err) {
        serverError(err, res);
    }
});

router.put("/:userID", (req, res) => {

})

router.patch("/:userID", authenticateToken, ensureCorrectUser, (req, res) => {
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

router.delete("/:userID", authenticateToken, ensureCorrectUser, (req, res) => {
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


export default router
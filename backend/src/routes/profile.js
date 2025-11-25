import express from "express";
import User from "../model/User.js";
import { serverError } from "../utils.js";

const router = express.Router();

router.get("/:userName", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.userName})
        if (user == null) {
            console.log("User Not Found")
            res.status(404).json({
                error: {
                    code: 0, // brak takiego uzytkownika
                    message: `No user found with given username: ${req.params.userName}`
                }
            })
            return;
        }

        const fullAvatarUrl = `${req.protocol}://${req.get('host')}/api/storage/avatars/${user.avatar}`;

        res.status(200).json({
            username: user.username,
            avatar: fullAvatarUrl,
            bitescore: user.bitescore,
            createDate: user.createDate
        });
    }
    catch(err) {
        serverError(err, res);
    }
})

export default router
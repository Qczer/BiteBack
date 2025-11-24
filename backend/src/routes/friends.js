import express from "express";
import mongoose from "mongoose";
import User from "../model/User.js";
import { authenticateToken } from "./user.js";

const router = express.Router();

// GET /api/friends/:userID
router.get('/:userID', authenticateToken, async (req, res) => {
    try {
        const { userID } = req.params;

        const currentUserID = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(userID))
            return res.status(400).json({ message: "Nieprawidłowe ID użytkownika." });

        if (userID !== currentUserID.toString()) {
            return res.status(403).json({
                message: "Brak uprawnień. Możesz przeglądać tylko własną listę znajomych."
            });
        }

        const user = await User.findById(userID)
            .populate('friends', 'username email avatar bitescore')
            .populate('friendRequests', 'username avatar');

        if (!user) {
            return res.status(404).json({ message: "Nie znaleziono użytkownika." });
        }

        res.status(200).json({
            userID: user._id,
            username: user.username,
            friends: user.friends,
            requests: user.friendRequests,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/friends/mutual/:userID
router.get('/mutual/:recipientID', authenticateToken, async (req, res) => {
    try {
        const { recipientID } = req.params;
        const currentUserID = req.user._id.toString();

        if (!mongoose.Types.ObjectId.isValid(recipientID))
            return res.status(400).json({ message: "Nieprawidłowe ID użytkownika." });

        const currentUser = await User.findById(currentUserID).populate('friends', '_id username avatar bitescore');
        const otherUser = await User.findById(recipientID).populate('friends', '_id username avatar bitescore');

        if (!currentUser || !otherUser)
            return res.status(404).json({ message: "Nie znaleziono użytkownika." });

        const currentFriends = currentUser.friends.map(f => f._id.toString());
        const otherFriends = otherUser.friends.map(f => f._id.toString());

        const mutualIDs = currentFriends.filter(id => otherFriends.includes(id));
        const mutualFriends = currentUser.friends.filter(f => mutualIDs.includes(f._id.toString()));

        res.status(200).json({
            userA: currentUserID,
            userB: recipientID,
            mutualFriends,
            mutualCount: mutualFriends.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/friends/request/:recipientName
router.post("/request/:recipientName", authenticateToken, async (req, res) => {
    const { recipientName } = req.params;
    const requesterID = req.user._id;

    try {
        const targetUser = await User.findOne({ username: recipientName } );

        if (!targetUser)
            return res.status(404).json({ message: "Użytkownik docelowy nie istnieje." });

        const recipientID = targetUser._id;

        if (requesterID.toString() === recipientID.toString())
            return res.status(400).json({ message: "Nie możesz dodać samego siebie." });

        const alreadyFriends = targetUser.friends.some(id => id.toString() === requesterID.toString());
        const alreadyRequested = targetUser.friendRequests.some(id => id.toString() === requesterID.toString());

        if (alreadyFriends) return res.status(400).json({ message: "Jesteście już znajomymi." });
        if (alreadyRequested) return res.status(400).json({ message: "Zaproszenie zostało już wysłane." });

        await User.findByIdAndUpdate(recipientID, {
            $addToSet: { friendRequests: requesterID }
        });

        res.status(200).json({ message: "Zaproszenie wysłane pomyślnie." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})

// POST /api/friends/accept/:requesterName
router.post("/accept/:requesterName", authenticateToken, async (req, res) => {
    const { requesterName } = req.params;
    const currentUserID = req.user._id;

    try {
        const requesterUser = await User.findOne({ username: requesterName });

        if (!requesterUser)
            return res.status(404).json({ message: "Użytkownik (wnioskodawca) nie istnieje." });

        const requesterID = requesterUser._id;
        const currentUser = await User.findById(currentUserID);

        const hasRequest = currentUser.friendRequests.some(
            id => id.toString() === requesterID.toString()
        );

        if (!hasRequest)
            return res.status(400).json({ message: `Brak zaproszenia od użytkownika ${requesterID}` });

        await User.findByIdAndUpdate(currentUserID, {
            $push: { friends: requesterID },
            $pull: { friendRequests: requesterID }
        });

        await User.findByIdAndUpdate(requesterID, {
            $push: { friends: currentUserID }
        });

        res.status(200).json({ message: "Zaproszenie zaakceptowane." });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// POST /api/friends/reject/:requesterName
router.post('/reject/:requesterName', authenticateToken, async (req, res) => {
    const { requesterName } = req.params;
    const currentUserID = req.user._id;

    try {
        const requesterUser = await User.findOne({ username: requesterName });

        if (!requesterUser)
            return res.status(404).json({ message: "Użytkownik nie istnieje." });

        const requesterID = requesterUser._id;

        await User.findByIdAndUpdate(currentUserID, {
            $pull: { friendRequests: requesterID }
        });

        res.status(200).json({ message: "Zaproszenie odrzucone." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/friends/:friendName
router.delete('/:friendName', authenticateToken, async (req, res) => {
    const { friendName } = req.params;
    const currentUserID = req.user._id;

    try {
        const friendUser = await User.findOne({ username: friendName });

        if (!friendUser)
            return res.status(400).json({ message: "Użytkownik o podanym nicku nie istnieje." });

        const friendID = friendUser._id;

        await User.findByIdAndUpdate(currentUserID, { $pull: { friends: friendID } });
        await User.findOneAndUpdate(friendID, { $pull: { friends: currentUserID } });

        res.status(200).json({ message: `Użytkownik ${friendName} został usunięty ze znajomych.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
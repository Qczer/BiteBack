import express from "express";
import mongoose from "mongoose";
import User from "../model/User.js";
import { authenticateToken, ensureCorrectUser } from "../middleware/auth.js";
import { sendNotification } from "../notificationsSystem.js";

const router = express.Router();

// GET /api/friends/:userID
router.get('/:userID', authenticateToken, ensureCorrectUser, async (req, res) => {
    try {
        const { userID } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userID))
            return res.status(400).json({ message: "Nieprawidłowe ID użytkownika." });

        const user = await User.findById(userID)
            .populate('friends', 'username email avatar bitescore')
            .populate('friendRequests', 'username avatar')
            .lean();

        if (!user)
            return res.status(404).json({ message: "Nie znaleziono użytkownika." });

        res.status(200).json({
            userID: user._id,
            username: user.username,
            friends: user.friends,
            requests: user.friendRequests,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/friends/mutual/:userID
router.get('/mutual/:recipientName', authenticateToken, async (req, res) => {
    try {
        const { recipientName } = req.params;
        const currentUserID = req.user._id.toString();

        const otherUser = await User.findOne({ username: recipientName }).populate('friends', '_id username avatar bitescore');
        if (!otherUser)
            return res.status(404).json({ message: "Nie znaleziono użytkownika o podanej nazwie." });

        const currentUser = await User.findById(currentUserID).populate('friends', '_id username avatar bitescore');
        if (!currentUser)
            return res.status(404).json({ message: "Błąd: obecny użytkownik nie istnieje." });

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
        const recipientUser = await User.findOne({ username: recipientName } );
        const requesterUser = await User.findOne({ _id: requesterID } );

        if (!recipientUser)
            return res.status(404).json({ message: "Użytkownik docelowy nie istnieje." });

        const recipientID = recipientUser._id;

        if (requesterID.toString() === recipientID.toString())
            return res.status(400).json({ message: "Nie możesz dodać samego siebie." });

        const alreadyFriends = recipientUser.friends.some(id => id.toString() === requesterID.toString());
        const alreadyRequested = recipientUser.friendRequests.some(id => id.toString() === requesterID.toString());

        if (alreadyFriends) return res.status(400).json({ message: "Jesteście już znajomymi." });
        if (alreadyRequested) return res.status(400).json({ message: "Zaproszenie zostało już wysłane." });

        await User.findByIdAndUpdate(recipientID, {
            $addToSet: { friendRequests: requesterID }
        });

        sendNotification(recipientID, "FRIEND_INVITE", { username: requesterUser.username });

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
            $push: { friends: currentUserID },
            $pull: { friendRequests: currentUserID }
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
    }
    catch (error) {
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
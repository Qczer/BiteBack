import express from "express";
import mongoose from "mongoose";
import User from "../model/User.js";
import { authenticateToken } from "./user.js";

const router = express.Router();

// --- 1. POBIERANIE ZNAJOMYCH DLA KONKRETNEGO ID ---
// GET /api/friends/:userID
router.get('/:userID', async (req, res) => {
    try {
        const { userID } = req.params;

        // Walidacja ID (czy to w ogóle jest poprawne ID MongoDB)
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({ message: "Nieprawidłowe ID użytkownika." });
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

// --- 2. WYSYŁANIE ZAPROSZENIA ---
// POST /api/friends/request/:recipientId
router.post("/request/:recipientId", authenticateToken, async (req, res) => {
    const { recipientId } = req.params;
    const requesterId = req.user._id;

    try {
        if (!mongoose.Types.ObjectId.isValid(recipientId))
            return res.status(400).json({ message: "Nieprawidłowe ID odbiorcy." });

        if (requesterId.toString() === recipientId)
            return res.status(400).json({ message: "Nie możesz dodać samego siebie." });

        const targetUser = await User.findById(recipientId);

        if (!targetUser)
            return res.status(404).json({ message: "Użytkownik docelowy nie istnieje." });

        // Sprawdzamy czy ID już są w tablicach (konwersja na string dla pewności)
        const alreadyFriends = targetUser.friends.some(id => id.toString() === requesterId.toString());
        const alreadyRequested = targetUser.friendRequests.some(id => id.toString() === requesterId.toString());

        if (alreadyFriends) return res.status(400).json({ message: "Jesteście już znajomymi." });
        if (alreadyRequested) return res.status(400).json({ message: "Zaproszenie zostało już wysłane." });

        // Dodajemy ID wysyłającego do requestów odbiorcy
        await User.findByIdAndUpdate(recipientId, {
            $addToSet: { friendRequests: requesterId }
        });

        res.status(200).json({ message: "Zaproszenie wysłane pomyślnie." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})

// --- 3. AKCEPTACJA ZAPROSZENIA ---
// POST /api/friends/accept/:requesterId (ID osoby, która nas zaprosiła)
router.post("/accept/:requesterId", authenticateToken, async (req, res) => {
    const { requesterId } = req.params;
    const currentUserId = req.user._id;

    try {
        if (!mongoose.Types.ObjectId.isValid(requesterId))
            return res.status(400).json({ message: "Nieprawidłowe ID." });

        const currentUser = await User.findById(currentUserId);

        // Sprawdzamy czy w ogóle mamy takie zaproszenie
        const hasRequest = currentUser.friendRequests.some(
            id => id.toString() === requesterId
        );

        if (!hasRequest) {
            return res.status(400).json({ message: "Brak zaproszenia od tego użytkownika." });
        }

        // Transakcja: Aktualizujemy obie strony

        // A. My: dodajemy znajomego, usuwamy request
        await User.findByIdAndUpdate(currentUserId, {
            $push: { friends: requesterId },
            $pull: { friendRequests: requesterId }
        });

        // B. On: dodaje nas do znajomych
        await User.findByIdAndUpdate(requesterId, {
            $push: { friends: currentUserId }
        });

        res.status(200).json({ message: "Zaproszenie zaakceptowane." });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// --- 4. ODRZUCENIE ZAPROSZENIA ---
// POST /api/friends/reject/:requesterId
router.post('/reject/:requesterId', authenticateToken, async (req, res) => {
    const { requesterId } = req.params;
    const currentUserId = req.user._id;

    try {
        if (!mongoose.Types.ObjectId.isValid(requesterId))
            return res.status(400).json({ message: "Nieprawidłowe ID." });

        // Usuwamy tylko request u nas
        await User.findByIdAndUpdate(currentUserId, {
            $pull: { friendRequests: requesterId }
        });

        res.status(200).json({ message: "Zaproszenie odrzucone." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- 5. USUWANIE ZNAJOMEGO (OPCJONALNE) ---
// DELETE /api/friends/:friendId
router.delete('/:friendId', authenticateToken, async (req, res) => {
    const { friendId } = req.params;
    const currentUserId = req.user._id;

    try {
        // Usuwamy u nas
        await User.findByIdAndUpdate(currentUserId, { $pull: { friends: friendId } });
        // Usuwamy u niego
        await User.findByIdAndUpdate(friendId, { $pull: { friends: currentUserId } });

        res.status(200).json({ message: "Znajomy usunięty." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import path from "path"
import multer from "multer";
import fs from "fs"

import User from "../model/User.js"
import Notification from "../model/Notification.js"
import {serverError} from "../utils.js";
import { authenticateToken, ensureCorrectUser } from "../middleware/auth.js";


const router = express.Router();

const JWT_EXPIRATION_TIME = "7d"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "storage/avatars";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const userID = req.params.userID;

    const ext = path.extname(file.originalname);
    const filePath = `api/storage/avatars/${userID}${ext}`;

    // usuwanie poprzedniego profilowego na podstawie wszystkich mozliwych extensions
    const possibleExt = [".jpg", ".jpeg", ".png", ".webp"];
    for (const e of possibleExt) {
      const oldPath = `api/storage/avatars/${userID}${e}`;
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    cb(null, `${userID}${ext}`);
  }
});

const upload = multer({ storage });

// MIDDLEWARE DO AUTORYZACJI



// Routes
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
            bitescore: 0,
            avatar: "nopfp.png",
            pushTokens: []
        })
        newUser.save().then(result => {
            res.status(201).json({
                message: "Registered user with username" + result.username + " successfully!",
                id: result._id
            })
        }).catch(err => {
            console.log(err)
            if (err.errorResponse.code == 11000) {
                res.status(409).json({
                    message: "This username is taken"
                })
                return
            }
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
    User.findOne({email: req.body.email}).then(user => {
        // brak autoryzacji (nie ma takiego uzytkownika)
        if (user == null) {
            return res.status(401).json({
                error: {
                    message: "Błędny email lub hasło."
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
                res.status(200).json(token)
            }
            else {
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
            message: err.message ?? "Błąd bazy danych"
        })
    })
})

// powinna byc jako middleware funkcja a nie endpoint?
router.get("/auth", authenticateToken, (req, res) => {
    res.status(200).json({
        message: "Authorized",
        userID: req.user._id
    })
})

router.get("/:userID", authenticateToken, ensureCorrectUser, async (req, res) => {
    const user = await User.findOne({_id: req.params.userID})
    if (user == null) {
        res.status(404).json({
            error: {
                code: 0, // brak takiego uzytkownika
                message: `No user found with given ID: ${req.params.userID}`
            }
        })
        return;
    }
    try {
        const userCopy = user.toObject()
        delete userCopy.password
        res.status(200).json(userCopy)
    }
    catch(err) {
        serverError(err, res);
    }
})

router.patch("/avatar/:userID", authenticateToken, ensureCorrectUser, upload.single("avatar"), async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ error: "Nie przesłano pliku 'avatar'" });

        const user = await User.findOne({_id: req.params.userID})
        if (!user)
            return res.status(404).json({ message: "User not found" })

        user.avatar = req.file.filename;
        console.log("Changing avatar to: ", req.file.filename);
        await user.save();
        return res.status(200).json({
            message: "Pomyślnie ustawiono zdjęcie profilowe",
            filename: req.file.filename,
            path: `/api/storage/avatars/${req.file.filename}`
        })
    }
    catch (err) {
        serverError(err, res);
        return;
    }
});


const ALLOWED_LANGS = ["pl", "en"];
router.patch("/:userID/lang", authenticateToken, ensureCorrectUser, (req, res) => {
    if (req.user._id !== req.params.userID) {
        return res.status(403).json({
            message: "Forbidden: You can only update your own account."
        });
    }

    const newLang = req.body.lang;

    if (!newLang || !ALLOWED_LANGS.includes(newLang)) {
        return res.status(400).json({
            message: `Invalid language. Allowed: ${ALLOWED_LANGS.join(", ")}`
        });
    }

    // 3. AKTUALIZACJA
    User.findByIdAndUpdate(
        req.params.userID,
        { lang: newLang },
        { new: true } // Zwraca zaktualizowany obiekt
    ).then(updatedUser => {
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Language updated successfully",
            lang: updatedUser.lang
        });
    }).catch(err => serverError(err, res));
})

router.post("/push-token", authenticateToken, async (req, res) => {
    const { token } = req.body;
    if (!token)
        return res.status(400).json({ error: "Token required" });

    try {
        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { pushTokens: token }
        });
        res.json({ ok: true });
    }
    catch (err) {
        serverError(err, res);
    }
})

// NOTIFICATIONS
router.get("/:userID/notifications", authenticateToken, ensureCorrectUser, async (req, res) => {
    try {
        const notifications = await Notification.find({
            userID: req.params.userID
        }).sort({ createdAt: -1 }).lean();

        const formattedNotifications = notifications.map(notif => ({
            ...notif,
            _id: notif._id.toString(),
            userID: notif.userID.toString(),
        }));

        res.status(200).json(formattedNotifications);
    }
    catch(err) {
        serverError(err, res);
    }
})

router.get("/:userID/notifications/unread", authenticateToken, ensureCorrectUser, async (req, res) => {
    try {
        const notifications = await Notification.find({
            userID: req.params.userID,
            isRead: false
        }).sort({ createdAt: -1 }).lean();

        const formattedNotifications = notifications.map(notif => ({
            ...notif,
            _id: notif._id.toString(),
            userID: notif.userID.toString(),
        }));

        res.status(200).json(formattedNotifications);
    }
    catch(err) {
        serverError(err, res);
    }
})

router.patch("/:userID/notifications/:notificationID/read", authenticateToken, ensureCorrectUser, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            {
                _id: req.params.notificationID,
                userID: req.params.userID
            },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                error: {
                    message: "Notification not found"
                }
            });
        }

        res.status(200).json(notification);
    }
    catch (err) {
        serverError(err, res);
    }
});

router.delete("/:userID/notifications/:notificationID", authenticateToken, ensureCorrectUser, async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.notificationID,
            userID: req.params.userID
        });

        if (!notification) {
            return res.status(404).json({
                error: {
                    message: "Notification not found"
                }
            });
        }

        res.status(200).json({
            message: "Notification deleted successfully",
            notification
        });
    }
    catch (err) {
        serverError(err, res);
    }
});

export default router
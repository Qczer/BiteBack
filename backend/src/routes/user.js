import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import path from "path"
import multer from "multer";

import User from "../model/User.js"
import {serverError} from "../utils.js";


const router = express.Router();

const JWT_EXPIRATION_TIME = "7d"

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./storage/avatars"); // folder na pliki
    },
    filename: function(req, file, cb) {
        const date = Date.now();
        cb(null, date + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// MIDDLEWARE DO AUTORYZACJI
export const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Brak nagłówka Authorization" });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Brak tokena w nagłówku (format: Bearer <token>)" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();

    } catch(err) {
        console.log("Auth Error:", err.message);

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token wygasł",
                code: "TOKEN_EXPIRED"
            });
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: "Nieprawidłowy token (zły podpis lub struktura)",
                code: "INVALID_TOKEN"
            });
        }

        return res.status(401).json({
            message: "Błąd autoryzacji",
            details: err.message
        });
    }
};


// Routes
// potencjalnie email do uzytkownika
router.post("/register", upload.single("avatar"), (req, res) => {
    
    bcrypt.hash(req.body.password, 15).then(hashed => {
        const newUser = new User({
            username: req.body.username,
            password: hashed,
            email: req.body.email,
            lang: req.body.lang || "pl",
            fridge: [],
            bitescore: 0,
            avatar: req.file ? req.file.filename : "nopfp.png"
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
                res.status(200).json(token)
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
router.get("/auth", authenticateToken, (req, res) => {
    res.status(200).json({
        message: "Authorized",
        userID: req.user._id
    })
})

// zamiennik za oczekiwane /profile 
router.get("/:userID", async (req, res) => {
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
        userCopy.avatar = `${req.protocol}://${req.get('host')}/storage/avatars/${user.avatar}`;
        res.status(200).json(userCopy)
    }
    catch(err) {
        serverError(err, res);
    }
})

const ALLOWED_LANGS = ["pl", "en"];
router.patch("/lang/:userID", authenticateToken, (req, res) => {
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

export default router
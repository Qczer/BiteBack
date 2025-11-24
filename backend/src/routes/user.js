import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import path from "path"
import multer from "multer";
import fs from "fs"

import User from "../model/User.js"
import {serverError} from "../utils.js";
import { authenticateToken, authenticateUser } from "../middleware/auth.js";


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
    const filePath = `storage/avatars/${userID}${ext}`;

    // usuwanie poprzedniego profilowego na podstawie wszystkich mozliwych extensions
    const possibleExt = [".jpg", ".jpeg", ".png", ".webp"];
    for (const e of possibleExt) {
      const oldPath = `storage/avatars/${userID}${e}`;
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    cb(null, `${userID}${ext}`);
  }
});

const upload = multer({ storage });

// MIDDLEWARE DO AUTORYZACJI



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

router.patch("/avatar/:userID", authenticateUser, upload.single("avatar"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Nie przesłano pliku 'avatar'" });
    }

    User.findOne({_id: req.params.userID}).then(user => {
        if (user == null) {
            res.status(404).json({
                message: "User not found"
            })
            return;
        }
        
        user.avatar = req.file.filename 
        user.save().then(result => {
            res.status(200).json({
                message: "Pomyślnie ustawiono zdjęcie profilowe",
                filename: req.file.filename,
                path: `/storage/avatars/${req.file.filename}`
            });
            return; 
        })
        
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
        return;        
    })

  
});


const ALLOWED_LANGS = ["pl", "en"];
router.patch("/lang/:userID", authenticateUser, (req, res) => {
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
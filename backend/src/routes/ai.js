const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

const router = express.Router();

// In-memory storage (no disk)
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) cb(null, true);
        else cb(new Error("Only image files are allowed"));
    },
});

// Route accepts image upload and forwards it to FastAPI
router.post("/scan", upload.single("image"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const form = new FormData();
    form.append("image", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
    });

    try {
        const response = await axios.post("http://ai:8001/scan/", form, {
            headers: form.getHeaders(), // enforces multipart/form-data
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });

        res.json(response.data.map(e => {
            return {
                name: e,
                amount: 0,
                unit: "kg",
                category: "junk",
                icon: null,
                expirationDate: null
            }
        }));
    } catch (err) {
        res
            .status(err.response?.status || 500)
            .json(err.response?.data || err.message);
    }
});

module.exports = router;

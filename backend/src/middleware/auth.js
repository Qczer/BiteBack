import jwt from "jsonwebtoken"


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
        if (req.user._id == req.params.userID)
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

export const authenticateUser = (req, res, next) => {
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
        if (req.user._id == req.params.userID) {
            next();
        } else {
            res.status(401).json({message: "Niepoprawny użykownik"})
        }

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
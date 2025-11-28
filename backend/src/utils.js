const serverError = (err, res) => {
    console.log(err)
    res.status(500).json({
        error: err
    })
}

const timeout = (ms) => (req, res, next) => {
    const timer = setTimeout(() => {
        if (!res.headersSent) {
            res.status(503).json({ error: "Request timeout" });
        }
    }, ms);

    res.on("finish", () => clearTimeout(timer));
    next();
};

export { serverError, timeout }
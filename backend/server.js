const express = require("express")
const dotationPointsRouter = require("./routes/dotation-point");
const userRouter = require("./routes/user");
require('dotenv').config();

const PORT = 5000;
const app = express()

app.use(express.json());

// Middleware do parsowania danych URL-encoded (formularze HTML)
app.use(express.urlencoded({ extended: true }));


app.use("/dotation-point", dotationPointsRouter)
app.use("/user", userRouter)


app.listen(PORT, () => {
    console.log("Server running on " + PORT)
})
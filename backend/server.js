require("dotenv").config()
const express = require("express");
const dotationPointsRouter = require("./src/routes/dotation-point");
const userRouter = require("./src/routes/user");
const fridgeRouter = require("./src/routes/fridge")
const aiRouter = require("./src/routes/ai")
const path = require("path")

const PORT = 8000;
const app = express()

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use('/storage', express.static(path.join(__dirname, 'storage')))

app.use("/dotation-point", dotationPointsRouter)
app.use("/user", userRouter)
app.use("/fridge", fridgeRouter)
app.use("/ai", aiRouter)

app.listen(PORT, () => {
    console.log("Server running on " + PORT)
})

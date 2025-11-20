require("dotenv").config()
const express = require("express");
const dotationPointsRouter = require("./src/routes/dotation-point");
const userRouter = require("./src/routes/user");
const fridgeRouter = require("./src/routes/fridge")

const PORT = process.env.PORT | 3000;
const app = express()

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.use("/dotation-point", dotationPointsRouter)
app.use("/user", userRouter)
app.use("/fridge", fridgeRouter)


app.listen(PORT, () => {  
    console.log("Server running on " + PORT)
})

require("dotenv").config()
const express = require("express");
const dotationPointsRouter = require("./src/routes/dotation-point");
const userRouter = require("./src/routes/user");
const fridgeRouter = require("./src/routes/fridge")
const path = require("path")
const fs = require("fs")

const PORT = process.env.PORT | 3000;
const app = express()


app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use('/storage', express.static(path.join(__dirname, 'storage')))



app.use("/dotation-point", dotationPointsRouter)
app.use("/user", userRouter)
app.use("/fridge", fridgeRouter)


app.listen(PORT, () => {  
    console.log("Server running on " + PORT)
})

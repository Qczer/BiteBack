import dotenv from "dotenv"
import mongoose from "mongoose";
import express from "express"
import { getRecipe } from "./src/model/Recipe.js";

import { userRoutes, fridgeRoutes, dotationPointRoutes, aiRoutes } from "./src/routes/index.js"


dotenv.config();

mongoose.connect(process.env.MONGO_URI);


// Configure app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/storage', express.static('storage'))

app.use("/user", userRoutes)
app.use("/fridge", fridgeRoutes)
app.use("/dotationPoint", dotationPointRoutes)
app.use("/ai", aiRoutes)
app.get("/recipe", async (req, res) => {
    const recipe = await getRecipe()
    if (recipe) {
        res.status(200).json(recipe)
    } else {
        res.status(500).json({message: "err"})
    }
})


// Run
app.listen(process.env.PORT, () => {
    console.info(`API running on port ${process.env.PORT}`)
})
import dotenv from "dotenv"
import mongoose from "mongoose";
import express from "express"

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


// Run
app.listen(process.env.PORT, () => {
    console.info(`API running on port ${process.env.PORT}`)
})

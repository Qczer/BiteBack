const mongoose = require("mongoose")
const Food = require("./Food")

const userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true, validate: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/},
    lang: {type: String, enum: ["pl", "en"], required: true, default: "pl"},
    fridge: [{type: mongoose.Types.ObjectId, ref: "Food", default: []}],
    bitescore: {type: Number, default: 0},
    avatar: {type: String, default: "nopfp.png"}
})

module.exports = mongoose.model("User", userSchema)
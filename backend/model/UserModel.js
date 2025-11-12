const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true, validate: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/},
    bitescore: {type: Number, default: 0}
})

module.exports = mongoose.model("User", userSchema, "user")
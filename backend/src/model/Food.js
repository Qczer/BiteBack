const mongoose = require("mongoose")

const foodSchema = mongoose.Schema({
    name: {type: String, required: true},
    amount: {type: Number, default: 1, required: true},
    unit: {type: String, enum: ["g", "kg", "ml", "l"]},
    category: {type: String, enum: ["junk", "snack", "vegetable", "fruit", "other"], required: true},
    iconUrl: {type: String, default: "no-photo.png"},
    expDate: {type: Date, required: true}
})

module.exports = mongoose.model("Food", foodSchema)
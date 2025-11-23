import mongoose from "mongoose"


const foodSchema = mongoose.Schema({
    name: {type: String, required: true},
    amount: {type: Number, default: 1, required: true},
    unit: {type: String, enum: ["g", "kg", "ml", "l", "pcs"]},
    category: {type: String, enum: ["junk", "snack", "vegetable", "fruit", "other"], required: true},
    iconUrl: {type: String, default: "no-photo.png"},
    expDate: {type: Date, required: true}
})

const Food = mongoose.model("Food", foodSchema)


export default Food
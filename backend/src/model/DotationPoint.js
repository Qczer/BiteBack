import mongoose from 'mongoose'


const dotationPointSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    description: {type: String, trim: true},
    city: {type: String, required: true, trim: true},
    postalCode: {type: String, trim: true},
    street: {type: String, trim: true},
    number: {type: String, trim: true},
    authorized: {type: Boolean, default: false},
    location: {
        type: {type: String, enum: ["Point"], required: true},
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    }
});

dotationPointSchema.index({name: "text"})
dotationPointSchema.index({location: "2dsphere"})

const DotationPoint = mongoose.model("DotationPoint", dotationPointSchema, "dotation-point")


export default DotationPoint
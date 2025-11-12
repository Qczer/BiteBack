const mongoose = require("mongoose")

const dotationPointSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  postalCode: { type: String, trim: true },
  street: { type: String, trim: true }, 
  number: { type: String, trim: true },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  }
});

dotationPointSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("DotationPoint", dotationPointSchema, "dotation-point")
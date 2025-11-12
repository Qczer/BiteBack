const express = require("express");
const DotationPoint = require("../model/DotationPoint");
// const isAuthorized = require("../middleware/is-authorized");
const router = express.Router();

// TODO: localhost - zamienic na baze lokalną
mongoose.connect("mongodb://localhost:27017/BiteBack");

router.get("/", (req, res) => {
    DotationPoint.find().then(doc => {
        if (doc.length <= 0) {
            return res.status(404).json({
                error: {
                    message: "No dotation points found"
                }
            })
        }
        res.status(200).json({
            message: "Dotation points tasks sucessfully!",
            count: doc.length,
            donationPoints: doc.map(donationPoints => {
                return {
                    ...donationPoints._doc,
                    
                }
            })
        })
    })
})

router.get("/:dotationPointID", (req, res) => {
    DotationPoint.findOne({_id: req.params.dotationPointID}).then(doc => {
        if (doc == null) {
            return res.status(404).json({
                error: {
                    message: "DotationPoint with provided ID is not found"
                }
            })
        }
        res.status(200).json({
            message: "Recieved task successfully!",
            dotationPoint: doc
        })
        
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

router.post("/", (req, res) => {
    const request = req.body
    const newDotationPoint = new DotationPoint({
        name: request.name,
        description: request.desc,
        city: request.city,
        postalCode: request.code,
        street: request.street, 
        number: request.number,
        location: {
            type: "Point",
            coordinates: [request.long, request.lat]
        }
    })
    newDotationPoint.save().then(result => {
        res.status(201).json({
            message: "Registered dotation point " + result.name + " successfully!",
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})


router.patch("/:dotationPointID", (req, res) => {
    res.status(200).send("PATCH DOTATION POINT" + req.params.dotationPointID)
})
router.delete("/:dotationPointID", (req, res) => {
    res.status(200).send("DELETE DOTATION POINT" + req.params.dotationPointID)
})

module.exports = router
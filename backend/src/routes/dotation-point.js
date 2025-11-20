const express = require("express");
const DotationPoint = require("../model/DotationPoint");
const mongoose = require("mongoose")
const nodemailer = require('nodemailer');

mongoose.connect(process.env.MONGO_URI);
const router = express.Router();

router.get("/", (req, res) => {
    let query = {authorizied: true}
    let projection = {}
    let name = req.query.name ? req.query.name.replaceAll("-", " ") : null;
    if (name) {
        console.log(name)
        query = {...query, $text: { $search: name } }
        projection = { score: { $meta: "textScore" } }
    }

    DotationPoint.find(query, projection).sort(name ? { score: { $meta: "textScore" } } : {}).then(donationPoints => {
        if (donationPoints.length <= 0) {
            return res.status(404).json({
                error: {
                    message: "No dotation points found"
                }
            })
        }
        res.status(200).json({
            count: donationPoints.length,
            donationPoints: donationPoints.map(point => {
                return {
                    ...point._doc,
                    
                }
            })
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

router.get("/near", (req, res) => {
  const { lng, lat, maxDistance } = req.body;
    DotationPoint.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      authorizied: true
    }).then(dotationPoints => {
        if (dotationPoints.length <= 0) {
            res.status(404).json({
                error: {
                    message: `No Dotation points found near you in distance of ${maxDistance}` 
                }
            })
        }
        res.status(200).json({
            count: dotationPoints.length,
            dotationPoints: [...dotationPoints]
        });
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
});

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
            dotationPoint: doc
        })
        
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

router.post("/new", (req, res) => {
    const request = req.body
    const newDotationPoint = new DotationPoint({
        name: request.name,
        description: request.desc,
        city: request.city,
        postalCode: request.code,
        street: request.street, 
        number: request.number,
        authorized: false,
        location: {
            type: "Point",
            coordinates: [request.lng, request.lat]
        }
    })
    newDotationPoint.save().then(result => {
        const isEmailSent = sendPointToAuth(newDotationPoint)
        if (isEmailSent) {
            res.status(201).json({
                message: "Dotation point " + result.name + " has been sent to administrator",
            })
        } else {
            res.status(500).json({
                message: "Something went wrong!"
            })
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

function sendPointToAuth(point) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // TODO: your gmail account 
            pass: process.env.EMAIL_PASSWORD // TODO: your gmail password
        }
    });

    let mailOptions = {
        from: `"BiteBack" ${process.env.EMAIL}`, // TODO: email sender
        to: process.env.ADMIN_EMAIL, // TODO: email receiver
        subject: 'New dotation point request',
        text: "Hello admin, \r\nThere is new request:\r\n " + point.name +
        `To response click: localhost:5000/dotation-point/auth/${point._id}`
    };

    result = true
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            result = false
        }
    });
    return result
}

// auth admina
router.patch("/auth/:dotationPointID", (req, res) => {
    DotationPoint.findById(req.params.dotationPointID).then((doc) => {
        if (doc.authorized == true) {
            res.status(200).json({message: "Dotation point is already authorized!"})
            return;
        }
        doc.authorized = true;
        doc.save()
        res.status(200).json({message: "Success! New dotation point is authorized!"})
    }).catch((e) => {
        res.status(404).json({
            message: "Point not found"
        })
    })
})

router.delete("/:dotationPointID", (req, res) => {
    res.status(200).send("DELETE DOTATION POINT" + req.params.dotationPointID)
})

module.exports = router
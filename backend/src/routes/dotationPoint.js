import express from "express"
import nodemailer from "nodemailer"
import DotationPoint from "../model/DotationPoint.js"
const router = express.Router();

// Routes
router.get("/", (req, res) => {
    DotationPoint.find({authorized: true}).then(dotationPoints => {
        if (dotationPoints.length <= 0) {
            return res.status(204).json({
                error: {
                    message: "No dotation points found"
                }
            })
        }
        res.status(200).json({
            count: dotationPoints.length,
            dotationPoints: dotationPoints.map(point => {
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

router.get("/near", async (req, res) => {
    try {
        const { lng, lat, maxDistance, name } = req.query;

        if (!lng || !lat || !maxDistance) {
            return res.status(400).json({ error: { message: "Missing coordinates or maxDistance" }});
        }

        const geoQuery = {
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(maxDistance)
                }
            },
            authorized: true
        };

        const geoResults = await DotationPoint.find(geoQuery).lean();

        if (!name) {
            if (geoResults.length === 0) {
                return res.status(204).json({
                    error: { message: `No Dotation points found near you in distance of ${maxDistance}` }
                });
            }

            return res.status(200).json({
                count: geoResults.length,
                dotationPoints: geoResults
            });
        }

        const textResults = await DotationPoint.find(
            { $text: { $search: name }, authorized: true },
            { score: { $meta: "textScore" } }
        ).sort(name ? { score: { $meta: "textScore" } } : {}).lean();


        const textIds = new Set(textResults.map(p => p._id.toString()));

        const finalResults = geoResults.filter(p =>
            textIds.has(p._id.toString())
        );

        if (finalResults.length === 0) {
            return res.status(204).json({
                error: { message: `No Dotation points found matching "${name}" in this area` }
            });
        }

        return res.status(200).json({
            count: finalResults.length,
            dotationPoints: finalResults
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err });
    }
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
        html:   `<!DOCTYPE html>
                <html lang="pl">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Akcja wymagana</title>
                <style>
                /* Ogólne style — wielu klientów ignoruje <style>, ale Gmail je akceptuje */
                body {
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f7;
                    font-family: Arial, sans-serif;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    background: #ffffff;
                    margin: 40px auto;
                    padding: 30px;
                    border-radius: 8px;
                }
                .button {
                    display: inline-block;
                    padding: 14px 24px;
                    background-color: #007bff;
                    color: #ffffff !important;
                    text-decoration: none;
                    border-radius: 6px;
                    font-size: 16px;
                    font-weight: bold;
                }
                .footer {
                    text-align: center;
                    color: #9a9ea6;
                    font-size: 12px;
                    margin-top: 30px;
                }
                </style>
                </head>

                <body>
                <div class="container">
                    <h2 style="color:#333;">${point.name}</h2>

                    
                    <h4>${point.city} ${point.postalCode} ${point.street} ${point.number}</h4>

                    <a href="https://https://biteback.pl/api/dotationPoint/auth/${point._id}" class="button"> Potwierdź punkt dotacji</a>
                </div>
                </body>
                </html>`
    };

    let result = true
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            result = false
        }
    });
    return result
}

// auth admina
router.get("/auth/:dotationPointID", (req, res) => {
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
    DotationPoint.deleteOne({_id: req.params.dotationPointID}).then(result => {
        res.status(204).json({result: result, message: "Dotation point deleted successfully!"})
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

export default router
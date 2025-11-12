// const jwt = require("jsonwebtoken")

// module.exports = (req, res, next) => {
//     try {
//         const token = req.headers.authorization.split(" ")[1] 
//         decoded = jwt.verify(token, process.env.JWT_SECRET)
//         console.log(decoded)
//         req.userId = decoded._id;
//         next()
//     } catch(err) {
//         console.log(err)
//         res.status(401).json({
//             error: {
//                 message: "Invalid or expired token!"
//             }
//         })
//     }
// }
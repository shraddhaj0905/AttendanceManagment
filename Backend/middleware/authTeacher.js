// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//     const token = req.body.token; // Extract token from request body
//     if (!token) {
//         return res.status(401).json({ message: "Access Denied. No token provided." });
//     }

//     try {
//         const verified = jwt.verify(token, process.env.JWT_SECRET);
//         if (verified.role !== "teacher") {
//             return res.status(403).json({ message: "Access denied. Only teachers can access this." });
//         }

//         req.teacher = verified; // Attach teacher data to request
//         next();
//     } catch (error) {
//         res.status(400).json({ message: "Invalid Token" });
//     }
// };
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers.authorization; // Extract token from headers

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET); // Extract token from "Bearer <token>"

        if (verified.role !== "teacher") {
            return res.status(403).json({ message: "Access denied. Only teachers can access this." });
        }

        req.teacher = verified; // Attach teacher data to request
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
};




// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//     const token = req.body.token; // Get token from request body
//     if (!token) {
//         console.log("No token provided!");
//         return res.status(401).json({ message: "Access Denied. No token provided." });
//     }

//     try {
//         const verified = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("Decoded Token Data:", verified); // Debugging log

//         if (!verified.roll_no) {
//             console.log("Error: roll_no is missing from token!");
//             return res.status(400).json({ message: "Invalid Token: Missing roll_no" });
//         }

//         if (verified.role !== "student") {
//             console.log("Access Denied: Not a student!");
//             return res.status(403).json({ message: "Access denied" });
//         }

//         req.student = verified; // Attach student data to request
//         console.log("Student data added to request:", req.student); // Debugging log
//         next();
//     } catch (error) {
//         console.error("JWT Verification Error:", error);
//         res.status(400).json({ message: "Invalid Token" });
//     }
// };

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization; // Extract token from headers

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("No token provided or invalid format!");
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract the actual token

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token Data:", verified); // Debugging log

        if (!verified.roll_no) {
            console.log("Error: roll_no is missing from token!");
            return res.status(400).json({ message: "Invalid Token: Missing roll_no" });
        }

        if (verified.role !== "student") {
            console.log("Access Denied: Not a student!");
            return res.status(403).json({ message: "Access denied" });
        }

        req.student = verified; // Attach student data to request
        
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(400).json({ message: "Invalid Token" });
    }
};


const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.cookies.token; // Token directly from cookie

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // No split here

        if (verified.role !== "teacher") {
            return res.status(403).json({ message: "Access denied. Only teachers can access this." });
        }

        req.teacher = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

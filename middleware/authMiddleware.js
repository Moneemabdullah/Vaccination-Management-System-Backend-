const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access Denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};

exports.adminOnly = (req, res, next) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ error: "Admin access only" });
    next();
};

exports.doctorOnly = (req, res, next) => {
    if (req.user.role !== "doctor")
        return res.status(403).json({ error: "Doctor access only" });
    next();
};

exports.patientOnly = (req, res, next) => {
    if (req.user.role !== "patient")
        return res.status(403).json({ error: "Patient access only" });
    next();
};

const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res
                .status(400)
                .json({ error: "Please provide all required fields" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const user = new User({ name, email, password, role });
        await user.save();

        res.status(201).json({ message: "Registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const bcrypt = require("bcrypt");
const Doctor = require("../models/DoctorProfile");

exports.docRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error: "User already exists with this email",
            });
        }
        // Create user entry
        const newUser = new User({
            name,
            email,
            password,
            role: "doctor",
        });
        await newUser.save();
        // Generate JWT
        const token = jwt.sign(
            { id: newUser._id, role: "doctor" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.status(201).json({
            message: "Doctor registered successfully. Pending approval.",
            token,
            doctor: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                isApproved: false,
            },
        });
    } catch (err) {
        console.error("Doctor registration failed:", err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            if (user.role === "doctor" && !user.isApproved) {
                return res.status(403).json({
                    error: "Doctor account is pending approval by admin",
                });
            }
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );
        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

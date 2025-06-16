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
const Doctor = require("../models/Doctor");

exports.docRegister = async (req, res) => {
    try {
        const { name, email, password, specialization, qualifications } =
            req.body;

        if (
            !name ||
            !email ||
            !password ||
            !specialization ||
            !qualifications
        ) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res
                .status(400)
                .json({ error: "Doctor already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const profilePhoto = req.file ? req.file.path : null;

        const newDoctor = new Doctor({
            name,
            email,
            password: hashedPassword,
            specialization,
            qualifications,
            profilePhoto,
            isApproved: false, // default state before admin approval
        });

        await newDoctor.save();

        const token = jwt.sign(
            { id: newDoctor._id, role: "doctor" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "Doctor registered successfully",
            token,
            doctor: {
                id: newDoctor._id,
                name: newDoctor.name,
                email: newDoctor.email,
                specialization: newDoctor.specialization,
                qualifications: newDoctor.qualifications,
                profilePhoto: newDoctor.profilePhoto,
                isApproved: newDoctor.isApproved,
            },
        });
    } catch (err) {
        console.error("Doctor registration failed:", err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = { register };

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
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

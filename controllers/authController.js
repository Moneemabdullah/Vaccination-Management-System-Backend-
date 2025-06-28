const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const DoctorProfile = require("../models/DoctorProfile");
const PatientProfile = require("../models/PaitentProfile");

// Register for generic users (e.g., patient)
exports.register = async (req, res) => {
    try {
        const { name, email, password, dateOfBirth, role } = req.body;

        if (!name || !email || !password || !role || !dateOfBirth) {
            return res
                .status(400)
                .json({ error: "Please provide all required fields." });
        }

        if (role !== "patient") {
            return res.status(400).json({
                error: "Only patients can register through this route.",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered." });
        }

        const newUser = new User({
            name,
            email,
            password,
            role,
        });
        await newUser.save();

        const patientProfile = new PatientProfile({
            user: newUser._id,
            dateOfBirth,
        });

        await patientProfile.save();

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            message: "Patient registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                dateOfBirth: patientProfile.dateOfBirth,
            },
        });
    } catch (err) {
        console.error("Patient registration error:", err);
        res.status(500).json({
            error: "Server error. Please try again later.",
        });
    }
};

// Doctor Registration
exports.docRegister = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            specialization,
            experience,
            qualifications,
            certifications,
            workingDays,
        } = req.body;

        // Handle multipart/form-data
        const profilePicture = req.file?.filename || req.body.profilePhoto;
        const parsedQualifications = Array.isArray(qualifications)
            ? qualifications
            : qualifications?.split(",").map((q) => q.trim()) || [];

        const parsedCertifications = Array.isArray(certifications)
            ? certifications
            : certifications?.split(",").map((c) => c.trim()) || [];

        const parsedWorkingDays = Array.isArray(workingDays)
            ? workingDays
            : workingDays
            ? JSON.parse(workingDays)
            : [];

        if (!name || !email || !password || !specialization) {
            return res.status(400).json({
                error: "Name, email, password, and specialization are required.",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(409)
                .json({ error: "User already exists with this email." });
        }

        const newUser = new User({
            name,
            email,
            password,
            role: "doctor",
        });
        await newUser.save();

        const doctorProfile = new DoctorProfile({
            user: newUser._id,
            specialization,
            experience: experience || 0,
            qualifications: parsedQualifications,
            certifications: parsedCertifications,
            workingDays: parsedWorkingDays,
            profilePicture: profilePicture || null,
            isApproved: false,
            rating: 0,
        });

        await doctorProfile.save();

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            message: "Doctor registered successfully. Awaiting admin approval.",
            token,
            doctor: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                specialization: doctorProfile.specialization,
                isApproved: doctorProfile.isApproved,
            },
        });
    } catch (err) {
        console.error("Doctor registration error:", err);
        res.status(500).json({
            error: "Server error. Please try again later.",
        });
    }
};
// Login for all users
// Login for all users
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        if (user.role === "doctor") {
            const profile = await DoctorProfile.findOne({ user: user._id });
            if (!profile?.isApproved) {
                return res.status(403).json({
                    error: "Doctor account is pending approval by admin.",
                });
            }
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            role: user.role,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            error: "Server error. Please try again later.",
        });
    }
};

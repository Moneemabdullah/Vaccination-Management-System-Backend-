const User = require("../models/UserModels");
const PatientProfile = require("../models/PaitentProfile");

exports.registerPatient = async (req, res) => {
    const { name, email, password, dateOfBirth, medicalHistory, role } =
        req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Create user with 'Patient' role
        const newUser = new User({
            name,
            email,
            password,
            roles: [role || "Patient"],
        });
        await newUser.save();

        // Create patient profile
        const patientProfile = new PatientProfile({
            user: newUser._id,
            dateOfBirth,
            medicalHistory,
            vaccinationHistory: [], // optional, can be added later
            appointments: [],
        });
        await patientProfile.save();

        res.status(201).json({
            message: "Patient registered successfully",
            userId: newUser._id,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Registration failed",
            details: err.message,
        });
    }
};

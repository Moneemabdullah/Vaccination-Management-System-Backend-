const User = require("../models/UserModels");
const DoctorProfile = require("../models/DoctorProfile");

exports.registerDoctor = async (req, res) => {
    const {
        name,
        email,
        password,
        role,
        specialization,
        experience,
        qualifications,
        certifications,
        workingDays,
    } = req.body;

    try {
        // Check if email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Create user
        const newUser = new User({
            name,
            email,
            password,
            roles: [role], // "Doctor" or "Patient"
        });

        await newUser.save();

        // If role is Doctor, create doctor profile
        if (role === "Doctor") {
            const newDoctorProfile = new DoctorProfile({
                user: newUser._id,
                specialization,
                experience,
                qualifications,
                certifications,
                workingDays,
            });

            await newDoctorProfile.save();
        }

        res.status(201).json({
            message: `${role} registered successfully`,
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

const User = require("../models/User");
const DoctorProfile = require("../models/DoctorProfile");
const mongoose = require("mongoose");
const Vaccine = require("../models/Vaccine");
const Appointments = require("../models/Appointment");

exports.getApprovedDoctors = async (req, res) => {
    try {
        // sand name from doctor profile
        const doctors = await DoctorProfile.find({ isApproved: true })
            .populate("user", "name email")
            .select("-password");

        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all available vaccines
exports.getVaccines = async (req, res) => {
    try {
        const vaccines = await Vaccine.find();
        res.json(vaccines);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.herocardController = async (req, res) => {
    try {
        const [numberOfAppointments, numberOfPatients, numberOfVaccines] =
            await Promise.all([
                Appointments.countDocuments(),
                User.countDocuments(),
                Vaccine.countDocuments(),
            ]);

        res.json({ numberOfPatients, numberOfVaccines, numberOfAppointments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// const mongoose = require("mongoose");
// const DoctorProfile = require("../models/DoctorProfile"); // Adjust the path to your model

exports.getDoctorById = async (req, res) => {
    try {
        // Fetching the doctor ID from URL params (doctor's user id)
        const doctorId = req.params.id;

        // Log the incoming ID to check if it's being passed correctly
        console.log("Received doctor ID:", doctorId);

        // Check if 'id' is provided
        if (!doctorId) {
            return res.status(400).json({ message: "Doctor ID is required" });
        }

        // Check if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({ message: "Invalid Doctor ID" });
        }

        // Find the doctor profile by the `user` field (matching the user id)
        const doctorProfile = await DoctorProfile.findOne({
            user: doctorId, // Find by the user ID (not the profile's ID)
        }).populate("user"); // Populate the user field with user details

        // If the doctor profile is not found
        if (!doctorProfile) {
            return res
                .status(404)
                .json({ message: "Doctor profile not found" });
        }

        // Send back the doctor profile
        res.status(200).json(doctorProfile);
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        res.status(500).json({ error: err.message });
    }
};

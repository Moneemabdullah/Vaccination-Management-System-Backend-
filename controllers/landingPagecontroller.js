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

exports.getDoctorById = async (req, res) => {
    try {
        const doctorId = req.params.id;

        if (!doctorId) {
            return res.status(400).json({ message: "Doctor ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({ message: "Invalid Doctor ID" });
        }

        const doctorProfile = await DoctorProfile.findOne({
            user: doctorId,
        }).populate("user");

        if (!doctorProfile) {
            return res
                .status(404)
                .json({ message: "Doctor profile not found" });
        }

        res.status(200).json(doctorProfile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

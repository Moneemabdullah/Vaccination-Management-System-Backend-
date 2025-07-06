const Appointment = require("../models/Appointment");
const User = require("../models/User");
const MedicalHistory = require("../models/MedicalHistory");
const sendEmail = require("../utils/sendEmail"); // <--- import sendEmail
const mongoose = require("mongoose");
const DoctorProfile = require("../models/DoctorProfile");

// Get all appointments for logged-in doctor
exports.getAppointments = async (req, res) => {
    try {
        // Ensure that req.user._id exists
        if (!req.user || !req.user._id) {
            return res.status(400).json({ error: "User not authenticated" });
        }

        // If you want appointments for a specific doctor passed via URL parameter (i.e., /appointments/:id)
        const doctorId = req.params.id; // Grab doctor ID from the URL parameter

        if (!doctorId) {
            return res.status(400).json({ error: "Doctor ID is required" });
        }

        // Find appointments for the doctor (either by URL param or user data)
        const appointments = await Appointment.find({ doctor: doctorId })
            .populate("patient", "name email") // Populate patient with name and email
            .populate("vaccine", "name"); // Populate vaccine with name

        // If no appointments found, return a message
        if (!appointments || appointments.length === 0) {
            return res
                .status(404)
                .json({ message: "No appointments found for this doctor" });
        }

        // Return the found appointments
        res.json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Update appointment status (approve/reject)
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndUpdate(
            { _id: req.params.id, doctor: req.user._id },
            { status: req.body.status },
            { new: true }
        )
            .populate("doctor", "name email")
            .populate("patient", "name email");

        if (!appointment) {
            return res
                .status(404)
                .json({ message: "Appointment not found or unauthorized" });
        }

        // Send notification email
        await sendEmail(
            appointment.patient.email,
            `Appointment ${req.body.status}`,
            `<p>Hi ${appointment.patient.name},</p>
             <p>Your appointment with Dr. ${appointment.doctor.name} has been <strong>${req.body.status}</strong>.</p>`
        );

        res.json(appointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get patient's medical history by ID
exports.getPatientMedicalHistory = async (req, res) => {
    try {
        const history = await MedicalHistory.findOne({
            patient: req.params.patientId,
        }).populate("vaccinationHistory.vaccine", "name");
        if (!history)
            return res
                .status(404)
                .json({ message: "No medical history found" });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update doctor profile
exports.updateDocProfile = async (req, res) => {
    try {
        const updates = req.body;
        const userId = req.user._id;

        // Update User fields
        const user = await User.findByIdAndUpdate(userId, updates.user || {}, {
            new: true,
            runValidators: true,
        }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Update DoctorProfile fields if provided
        let doctorProfile = await DoctorProfile.findOne({ user: userId });
        if (doctorProfile && updates.profile) {
            Object.assign(doctorProfile, updates.profile);
            await doctorProfile.save();
        }

        // Populate user field in doctorProfile for response
        doctorProfile = await DoctorProfile.findOne({ user: userId }).populate(
            "user"
        );

        res.json({
            user,
            doctorProfile,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const Appointment = require("../models/Appointment");
const User = require("../models/User");
const MedicalHistory = require("../models/MedicalHistory");
const sendEmail = require("../utils/sendEmail"); // <--- import sendEmail

// Get all appointments for logged-in doctor
exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user._id })
            .populate("patient", "name email")
            .populate("vaccine", "name");
        res.json(appointments);
    } catch (err) {
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

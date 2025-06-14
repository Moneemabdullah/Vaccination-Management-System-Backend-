const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Vaccine = require("../models/Vaccine");
const MedicalHistory = require("../models/MedicalHistory");
const sendEmail = require("../utils/sendEmail");

// Book an appointment
exports.bookAppointment = async (req, res) => {
    try {
        const { doctorId, vaccineId, date } = req.body;
        const appointment = new Appointment({
            doctor: doctorId,
            patient: req.user._id,
            vaccine: vaccineId,
            date,
        });
        await appointment.save();

        // Notify doctor and patient
        const doctor = await User.findById(doctorId);
        const patient = await User.findById(req.user._id); // safer than using `req.user` directly

        await sendEmail(
            doctor.email,
            "New Appointment Request",
            `<p>Hi Dr. ${doctor.name},</p>
         <p>You have a new appointment request from ${patient.name} for ${date}.</p>`
        );

        await sendEmail(
            patient.email,
            "Appointment Booked",
            `<p>Hi ${patient.name},</p>
         <p>Your appointment with Dr. ${doctor.name} has been requested for ${date}.</p>`
        );

        res.status(201).json(appointment); // ⬅️ final response here
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// View my appointments
exports.getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user._id })
            .populate("doctor", "name email")
            .populate("vaccine", "name");
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all approved doctors
exports.getApprovedDoctors = async (req, res) => {
    try {
        const doctors = await User.find({
            role: "doctor",
            isApproved: true,
        }).select("-password");
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

// Update or create medical history
exports.updateMedicalHistory = async (req, res) => {
    try {
        const history = await MedicalHistory.findOneAndUpdate(
            { patient: req.user._id },
            req.body,
            { upsert: true, new: true }
        );
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get own medical history
exports.getMyMedicalHistory = async (req, res) => {
    try {
        const history = await MedicalHistory.findOne({
            patient: req.user._id,
        }).populate("vaccinationHistory.vaccine", "name");
        res.json(history || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

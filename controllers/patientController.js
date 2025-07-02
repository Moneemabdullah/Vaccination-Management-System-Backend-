const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Vaccine = require("../models/Vaccine");
const MedicalHistory = require("../models/MedicalHistory");
const sendEmail = require("../utils/sendEmail");
const PatientProfile = require("../models/PaitentProfile");

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

        res.status(201).json(appointment);
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

exports.getPatientProfileById = async (req, res) => {
    try {
        const patientId = req.params.userid;

        // Querying for the patient with the correct reference to the user ObjectId
        const patient = await PatientProfile.findOne({
            "user._id": patientId, // Directly matching the ObjectId
        }).populate("user", "name email role");

        if (!patient) {
            return res
                .status(404)
                .json({ message: "Patient profile not found" });
        }

        res.json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update own profile
exports.updateMyProfile = async (req, res) => {
    try {
        const patient = await PatientProfile.findOneAndUpdate(
            { user: req.user._id },
            req.body,
            {
                new: true,
                upsert: true,
            }
        ).populate("user", "name email");
        res.json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

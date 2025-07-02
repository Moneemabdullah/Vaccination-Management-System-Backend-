const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Vaccine = require("../models/Vaccine");
const MedicalHistory = require("../models/MedicalHistory");
const sendEmail = require("../utils/sendEmail");
const vaccination = require("../models/Vaccination");
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

// Get all approved doctors

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
        const patientId = req.params.user.id; // Patient ID from the route parameters

        // Find the patient profile by the provided patient ID
        const patient = await PatientProfile.findOne({ _id: patientId })
            .populate("user", "name email role") // Populate user fields (name, email, role)
            .populate({
                path: "vaccinationHistory", // Populate vaccination history
                populate: {
                    path: "vaccine", // Populate vaccine reference
                    select: "name manufacturer description", // Select relevant vaccine fields
                },
            });

        // If no patient found, return a 404 error
        if (!patient) {
            return res
                .status(404)
                .json({ message: "Patient profile not found" });
        }

        // Respond with the patient profile data
        res.json(patient);
    } catch (err) {
        // Handle any errors that occur
        res.status(500).json({ error: err.message });
    }
};
// Update own profile
exports.updateMyProfile = async (req, res) => {
    try {
        const patient = await patientProfile
            .findOneAndUpdate({ user: req.user._id }, req.body, {
                new: true,
                upsert: true,
            })
            .populate("user", "name email")
            .populate("vaccinationHistory.vaccine", "name");
        res.json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

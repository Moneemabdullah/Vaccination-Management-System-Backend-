const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Vaccine = require("../models/Vaccine");
const MedicalHistory = require("../models/MedicalHistory");
const sendEmail = require("../utils/sendEmail");
const PatientProfile = require("../models/PaitentProfile");
const mongoose = require("mongoose");
const { log } = require("console");

exports.bookAppointment = async (req, res) => {
    try {
        const { doctor, patient, vaccine, date, time, reason } = req.body;

        // Create appointment
        const appointment = new Appointment({
            doctor,
            patient,
            vaccine,
            date,
            time,
            reason,
        });

        await appointment.save();

        // Notify doctor and patient
        const doctorUser = await User.findById(doctor);
        const patientUser = await User.findById(patient);

        await sendEmail(
            doctorUser.email,
            "New Appointment Request",
            `<p>Hi Dr. ${doctorUser.name},</p>
            <p>You have a new appointment request from ${
                patientUser.name
            } for ${date} at ${time}.</p>
            <p>Reason: ${reason || "Not specified"}</p>`
        );

        await sendEmail(
            patientUser.email,
            "Appointment Booked",
            `<p>Hi ${patientUser.name},</p>
            <p>Your appointment with Dr. ${
                doctorUser.name
            } has been requested for ${date} at ${time}.</p>
            <p>Reason: ${reason || "Not specified"}</p>`
        );

        res.status(201).json(appointment);
    } catch (err) {
        console.error("Error booking appointment:", err);
        res.status(500).json({ error: err.message });
    }
};

// View my appointments
exports.getMyAppointments = async (req, res) => {
    try {
        const patientId = req.params.id;

        if (!patientId) {
            return res.status(400).json({ error: "Patient ID is required" });
        }

        const appointments = await Appointment.find({ patient: patientId })
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
        const patientId = req.params.id;

        // Validate the patient ID format (optional but recommended)

        if (!patientId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid patient ID." });
        }

        // Ensure allergies & chronicDiseases are arrays if they exist
        if (req.body.allergies && !Array.isArray(req.body.allergies)) {
            return res
                .status(400)
                .json({ error: "Allergies must be an array." });
        }
        if (
            req.body.chronicDiseases &&
            !Array.isArray(req.body.chronicDiseases)
        ) {
            return res
                .status(400)
                .json({ error: "Chronic diseases must be an array." });
        }

        const history = await MedicalHistory.findOneAndUpdate(
            { patient: patientId },
            { ...req.body, patient: patientId },
            { upsert: true, new: true }
        ).populate("vaccinationHistory.vaccine");

        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get own medical history
exports.getMedicalHistoryByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const history = await MedicalHistory.findOne({
            patient: userId,
        }).populate("vaccinationHistory.vaccine", "name");

        if (!history) {
            return res.status(404).json({ error: "Medical history not found" });
        }

        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPatientProfileById = async (req, res) => {
    try {
        const userId = req.params.id;
        const patient = await PatientProfile.findOne({
            user: userId,
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

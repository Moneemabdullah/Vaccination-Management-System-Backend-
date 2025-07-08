const Appointment = require("../models/Appointment");
const User = require("../models/User");
const MedicalHistory = require("../models/MedicalHistory");
const sendEmail = require("../utils/sendEmail");
const mongoose = require("mongoose");
const DoctorProfile = require("../models/DoctorProfile");

// Get all appointments for a doctor by ID (no auth check)
exports.getAppointments = async (req, res) => {
    try {
        const doctorId = req.params.id;

        if (!doctorId) {
            return res.status(400).json({ error: "Doctor ID is required" });
        }

        const appointments = await Appointment.find({ doctor: doctorId })
            .populate("patient", "name email")
            .populate("vaccine", "name");

        if (!appointments || appointments.length === 0) {
            return res
                .status(404)
                .json({ message: "No appointments found for this doctor" });
        }

        res.json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Update appointment status (approve/reject) without auth
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const appointmentId = req.params.id;

        if (!appointmentId) {
            return res
                .status(400)
                .json({ error: "Appointment ID is required" });
        }

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        // Update appointment without checking doctor ownership
        const appointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { status },
            { new: true }
        )
            .populate("doctor", "name email")
            .populate("patient", "name email");

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Send notification email
        await sendEmail(
            appointment.patient.email,
            `Appointment ${status}`,
            `<p>Hi ${appointment.patient.name},</p>
             <p>Your appointment with Dr. ${appointment.doctor.name} has been <strong>${status}</strong>.</p>`
        );

        res.json(appointment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Get patient's medical history by ID without auth
exports.getPatientMedicalHistory = async (req, res) => {
    try {
        const patientId = req.params.patientId;

        if (!patientId) {
            return res.status(400).json({ error: "Patient ID is required" });
        }

        const history = await MedicalHistory.findOne({
            patient: patientId,
        }).populate("vaccinationHistory.vaccine", "name");

        if (!history) {
            return res
                .status(404)
                .json({ message: "No medical history found" });
        }

        res.json(history);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Update doctor profile without auth
exports.updateDoctorProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProfile = req.body.profile;

        if (!id) {
            return res.status(400).json({ message: "Doctor ID is required" });
        }

        if (!updatedProfile) {
            return res.status(400).json({ message: "Profile data is missing" });
        }

        const doctorProfile = await DoctorProfile.findOne({ user: id });

        if (!doctorProfile) {
            return res
                .status(404)
                .json({ message: "Doctor profile not found" });
        }

        if (updatedProfile.specialization !== undefined) {
            doctorProfile.specialization = updatedProfile.specialization;
        }
        if (updatedProfile.experience !== undefined) {
            doctorProfile.experience = updatedProfile.experience;
        }
        if (updatedProfile.qualifications !== undefined) {
            doctorProfile.qualifications = updatedProfile.qualifications;
        }
        if (updatedProfile.certifications !== undefined) {
            doctorProfile.certifications = updatedProfile.certifications;
        }
        if (updatedProfile.workingDays !== undefined) {
            if (
                !Array.isArray(updatedProfile.workingDays) ||
                !updatedProfile.workingDays.every(
                    (day) => typeof day === "string" && day.trim() !== ""
                )
            ) {
                return res.status(400).json({
                    message: "workingDays must be a non-empty array of strings",
                });
            }
            doctorProfile.workingDays = updatedProfile.workingDays;
        }
        if (updatedProfile.profilePicture !== undefined) {
            doctorProfile.profilePicture = updatedProfile.profilePicture;
        }

        const savedProfile = await doctorProfile.save();
        res.status(200).json({ doctorProfile: savedProfile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating doctor profile" });
    }
};

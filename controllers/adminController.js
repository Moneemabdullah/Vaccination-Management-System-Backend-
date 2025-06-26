const User = require("../models/User");
const Vaccine = require("../models/Vaccine");
const DoctorProfile = require("../models/DoctorProfile");
const Appointment = require("../models/Appointment");
const sendEmail = require("../utils/sendEmail");

// Approve a doctor
exports.approveDoctor = async (req, res) => {
    try {
        console.log(
            "Received request to approve doctor with ID:",
            req.params.id
        );

        const doctor = await DoctorProfile.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        ).populate("user");

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const userName = doctor.user?.name || "Doctor";
        const userEmail = doctor.user?.email;

        if (!userEmail) {
            return res.status(400).json({ message: "Doctor email not found" });
        }

        const emailContent = `Dear ${userName}, Your application to become a doctor has been approved.`;
        await sendEmail(userEmail, "Doctor Application Approved", emailContent);

        res.status(200).json(doctor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a new vaccine
exports.addVaccine = async (req, res) => {
    try {
        const vaccine = new Vaccine(req.body);
        await vaccine.save();
        res.status(201).json(vaccine);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get vaccine by ID
exports.getVaccineById = async (req, res) => {
    try {
        const vaccine = await Vaccine.findById(req.params.id);
        if (!vaccine) {
            return res.status(404).json({ message: "Vaccine not found" });
        }
        res.status(200).json(vaccine);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all doctors (with profile info)
exports.getDoctors = async (req, res) => {
    try {
        const doctors = await DoctorProfile.find().populate("user");
        res.status(200).json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single doctor by user ID
exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await User.findById(req.params.id);
        if (!doctor || doctor.role !== "doctor") {
            return res.status(404).json({ message: "Doctor not found" });
        }
        res.status(200).json(doctor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Remove doctor by user ID
exports.removeDoctor = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== "doctor") {
            return res.status(404).json({ message: "Doctor not found" });
        }

        await DoctorProfile.findOneAndDelete({ user: user._id });
        await user.deleteOne();

        res.status(200).json({ message: "Doctor removed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete vaccine by ID
exports.deleteVaccine = async (req, res) => {
    try {
        const vaccine = await Vaccine.findByIdAndDelete(req.params.id);
        if (!vaccine) {
            return res.status(404).json({ message: "Vaccine not found" });
        }
        res.status(200).json({ message: "Vaccine deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get dashboard stats
exports.allnumbersControllers = async (req, res) => {
    try {
        const totalPatients = await User.countDocuments({ role: "patient" });
        const totalDoctors = await User.countDocuments({ role: "doctor" });
        const totalVaccines = await Vaccine.countDocuments();
        const totalAppointments = await Appointment.countDocuments();
        const totalUsers = await User.countDocuments();

        res.status(200).json({
            totalPatients,
            totalDoctors,
            totalVaccines,
            totalAppointments,
            totalUsers,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const allUser = await User.find();
        if (!allUser.length) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json(allUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all unapproved doctors (from DoctorProfile)
exports.getUnapprovedDoctors = async (req, res) => {
    try {
        const unapprovedDoctors = await DoctorProfile.find({
            isApproved: false,
        }).populate("user");
        if (!unapprovedDoctors.length) {
            return res
                .status(404)
                .json({ message: "No unapproved doctors found" });
        }
        res.status(200).json(unapprovedDoctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

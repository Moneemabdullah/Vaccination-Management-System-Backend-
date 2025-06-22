const User = require("../models/User");
const Vaccine = require("../models/Vaccine");
const Appointment = require("../models/Appointment");

exports.approveDoctor = async (req, res) => {
    try {
        const doctor = await User.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        );
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addVaccine = async (req, res) => {
    try {
        const vaccine = new Vaccine(req.body);
        await vaccine.save();
        res.status(201).json(vaccine);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDoctors = async (req, res) => {
    const doctors = await User.find({ role: "doctor" });
    res.json(doctors);
};

exports.removeDoctor = async (req, res) => {
    try {
        const doctor = await User.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        res.json({ message: "Doctor removed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteVaccine = async (req, res) => {
    try {
        const vaccine = await Vaccine.findByIdAndDelete(req.params.id);
        if (!vaccine) {
            return res.status(404).json({ message: "Vaccine not found" });
        }
        res.json({ message: "Vaccine deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.allnumbersControllers = async (req, res) => {
    try {
        const totalPatients = await User.countDocuments({ role: "patient" });
        const totalDoctors = await User.countDocuments({ role: "doctor" });
        const totalVaccines = await Vaccine.countDocuments();
        const totalAppointments = await Appointment.countDocuments();
        const totalUsers = await User.countDocuments();

        res.json({
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

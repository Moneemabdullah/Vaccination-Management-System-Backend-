const User = require("../models/User");
const Vaccine = require("../models/Vaccine");
const Appointment = require("../models/Appointment");

/**
 * Approve a doctor by ID
 * PUT /api/admin/approve-doctor/:id
 */
exports.approveDoctor = async (req, res) => {
    try {
        const doctor = await User.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        );
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        res.status(200).json(doctor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Add a new vaccine
 */
exports.addVaccine = async (req, res) => {
    try {
        const vaccine = new Vaccine(req.body);
        await vaccine.save();
        res.status(201).json(vaccine);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get all doctors
 */
exports.getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: "doctor" });
        res.status(200).json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Remove a doctor by ID
 * DELETE /api/admin/remove-doctor/:id
 */
exports.removeDoctor = async (req, res) => {
    try {
        const doctor = await User.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        res.status(200).json({ message: "Doctor removed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Delete a vaccine by ID
 */
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

/**
 * Get dashboard numbers
 */
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

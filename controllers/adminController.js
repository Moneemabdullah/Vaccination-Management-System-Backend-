const User = require("../models/User");
const Vaccine = require("../models/Vaccine");

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

const User = require("../models/User");
const Vaccine = require("../models/Vaccine");
const Appinments = require("../models/Appointment");

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

exports.herocardController = async (req, res) => {
    try {
        const numberOfappoinments = Appinments.countDocuments;
        const numberOfPaitent = User.countDocuments;
        const numberOfVaccins = Vaccine.countDocuments;

        res.json({ numberOfPaitent, numberOfVaccins, numberOfappoinments });
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
};

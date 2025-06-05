const DoctorProfile = require("../models/DoctorProfile");
const PatientProfile = require("../models/PaitentProfile");
const Vaccination = require("../models/VaccinationModel");

exports.cardSectionController = async (req, res) => {
    try {
        const doctors = (await DoctorProfile.find()).length;
        const vaccinations = await Vaccination.find().length;
        const patients = await PatientProfile.find().length;

        res.status(200).json({
            doctors,
            vaccinations,
            patients,
        });
    } catch (error) {
        console.error("Error fetching card section data:", error);
        res.status(500).json({ error: "Failed to fetch card section data" });
    }
};

exports.allVaccinCardController = async (req, res) => {
    try {
        const vaccinations = await Vaccination.find();
        res.status(200).json(vaccinations);
    } catch (error) {
        console.error("Error fetching all vaccination cards:", error);
        res.status(500).json({
            error: "Failed to fetch all vaccination cards",
        });
    }
};

exports.allDoctorsController = async (req, res) => {
    try {
        const doctors = await DoctorProfile.find();
        res.status(200).json(doctors);
    } catch (error) {
        console.error("Error fetching all doctors:", error);
        res.status(500).json({ error: "Failed to fetch all doctors" });
    }
};

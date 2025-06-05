const PatientProfile = require("../models/PaitentProfile");
const MedicalHistory = require("../models/MedicalHistory");

router.post("/updatePatientMedicalHistory/:id", async (req, res) => {
    const patientId = req.params.id;
    const {
        allergies,
        chronicDiseases,
        medications,
        surgeries,
        familyHistory,
    } = req.body;

    try {
        // Try to find existing history
        let history = await MedicalHistory.findOne({ patient: patientId });

        if (history) {
            // Update existing record
            history.allergies = allergies || history.allergies;
            history.chronicDiseases =
                chronicDiseases || history.chronicDiseases;
            history.medications = medications || history.medications;
            history.surgeries = surgeries || history.surgeries;
            history.familyHistory = familyHistory || history.familyHistory;

            await history.save();
            return res
                .status(200)
                .json({ message: "Medical history updated", history });
        } else {
            // Create new record
            const newHistory = new MedicalHistory({
                patient: patientId,
                allergies,
                chronicDiseases,
                medications,
                surgeries,
                familyHistory,
            });

            await newHistory.save();
            return res.status(201).json({
                message: "Medical history created",
                history: newHistory,
            });
        }
    } catch (error) {
        console.error("Error updating medical history:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

module.exports = router;
// Update patient information
router.put("/updatePatientInfo/:id", async (req, res) => {
    const patientId = req.params.id;
    const { name, dateOfBirth, address, phoneNumber } = req.body;

    try {
        // Find the patient profile by ID
        const patientProfile = await PatientProfile.findById(patientId);
        if (!patientProfile) {
            return res.status(404).json({ error: "Patient not found" });
        }

        // Update the patient profile fields
        if (name) patientProfile.name = name;
        if (dateOfBirth) patientProfile.dateOfBirth = dateOfBirth;
        if (address) patientProfile.address = address;
        if (phoneNumber) patientProfile.phoneNumber = phoneNumber;

        // Save the updated profile
        await patientProfile.save();

        res.status(200).json({
            message: "Patient information updated successfully",
            patientProfile,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to update patient information",
            details: err.message,
        });
    }
});

module.exports updatePatientMedicalHistory = async (req, res) => {
    const patientId = req.params.id;
    const {
        allergies,
        chronicDiseases,
        medications,
        surgeries,
        familyHistory,
    } = req.body;

    try {
        // Try to find existing history
        let history = await MedicalHistory.findOne({ patient: patientId });

        if (history) {
            // Update existing record
            history.allergies = allergies || history.allergies;
            history.chronicDiseases =
                chronicDiseases || history.chronicDiseases;
            history.medications = medications || history.medications;
            history.surgeries = surgeries || history.surgeries;
            history.familyHistory = familyHistory || history.familyHistory;

            await history.save();
            return res
                .status(200)
                .json({ message: "Medical history updated", history });
        } else {
            // Create new record
            const newHistory = new MedicalHistory({
                patient: patientId,
                allergies,
                chronicDiseases,
                medications,
                surgeries,
                familyHistory,
            });

            await newHistory.save();
            return res.status(201).json({
                message: "Medical history created",
                history: newHistory,
            });
        }
    } catch (error) {
        console.error("Error updating medical history:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

module.exports = router;

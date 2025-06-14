const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    allergies: [String],
    chronicDiseases: [String],
    medications: [
        {
            name: String,
            dosage: String,
            frequency: String,
        },
    ],
    vaccinationHistory: [
        {
            vaccine: { type: mongoose.Schema.Types.ObjectId, ref: "Vaccine" },
            date: Date,
        },
    ],
});

module.exports = mongoose.model("MedicalHistory", medicalHistorySchema);

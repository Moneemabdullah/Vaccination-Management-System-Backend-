const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PatientProfile",
        required: true,
    },
    allergies: [{ type: String }],
    chronicDiseases: [{ type: String }],
    medications: [
        {
            name: { type: String, required: true },
            dosage: { type: String, required: true },
            frequency: { type: String, required: true },
        },
    ],
    surgeries: [
        {
            name: { type: String, required: true },
            date: { type: Date, required: true },
            notes: { type: String },
        },
    ],
    familyHistory: [
        {
            relation: { type: String, required: true },
            condition: { type: String, required: true },
        },
    ],
});

module.exports = mongoose.model("MedicalHistory", medicalHistorySchema);

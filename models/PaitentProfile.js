const mongoose = require("mongoose");

const patientProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    vaccinationHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vaccination",
        },
    ],
    medicalHistory: {
        type: String,
        required: true,
    },
    appointments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
        },
    ],
});

export const PatientProfile = mongoose.model(
    "PatientProfile",
    patientProfileSchema
);

const mongoose = require("mongoose");

const patientProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "default-profile-picture.png",
    },
    vaccinationHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vaccination",
        },
    ],
});

module.export = mongoose.model("PatientProfile", patientProfileSchema);

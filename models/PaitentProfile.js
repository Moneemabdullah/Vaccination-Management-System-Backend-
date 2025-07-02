const mongoose = require("mongoose");

const patientProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    dateOfBirth: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model("PatientProfile", patientProfileSchema);

const mongoose = require("mongoose");

const vaccinationSchema = new mongoose.Schema({
    vaccine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vaccine",
    },
    dateAdministered: { type: Date, required: true },
    doseNumber: { type: Number, required: true },
    administeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the user (e.g., doctor/admin)
    notes: String,
});

module.exports = mongoose.model("Vaccination", vaccinationSchema);

const mongoose = require("mongoose");

const doseSchema = new mongoose.Schema({
    doseNumber: {
        type: Number,
        required: true,
    },
    DaysAfterPreviousDose: {
        type: Number,
        required: true,
    },
});

const vaccineModuleSchema = new mongoose.Schema({
    vaccineName: {
        type: String,
        required: true,
    },
    manufacturer: {
        type: String,
        required: true,
    },
    dosage: {
        type: String,
        required: true,
    },
    sideEffects: {
        type: String,
        required: true,
    },
    timelineforDoses: [doseSchema],
});

module.exports = mongoose.model("Vaccine", vaccineModuleSchema);

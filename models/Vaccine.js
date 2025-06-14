const mongoose = require("mongoose");

const vaccineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: String,
    description: String,
    dosesRequired: { type: Number, default: 1 },
    gapBetweenDoses: Number, // in days
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vaccine", vaccineSchema);

const mongoose = require("mongoose");

const vaccinationSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PatientProfile",
        required: true,
    },
    vaccine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vaccine",
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DoctorProfile",
        required: true,
    },
    status: {
        type: String,
        enum: ["Running", "Completed", "Cancelled"],
        default: "Pending",
    },
});

module.export = mongoose.model("Vaccination", vaccinationSchema);

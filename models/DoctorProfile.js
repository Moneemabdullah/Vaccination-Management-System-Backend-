const mongoose = require("mongoose");

const doctorProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    specialization: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        required: true,
    },
    qualifications: [
        {
            type: String,
            required: true,
        },
    ],
    certifications: [
        {
            type: String,
            required: true,
        },
    ],
    appointments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
        },
    ],
    workingDays: [
        {
            day: { type: String },
            startTime: { type: String },
            endTime: { type: String },
        },
    ],
});

module.export = mongoose.model("DoctorProfile", doctorProfileSchema);

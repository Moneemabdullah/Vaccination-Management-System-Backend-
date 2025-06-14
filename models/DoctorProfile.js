const mongoose = require("mongoose");

const doctorProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    specialization: { type: String },
    profilePicture: {
        type: String,
        default: "default-profile-picture.png",
    },
    experience: { type: Number },
    qualifications: [{ type: String }],
    certifications: [{ type: String }],
    workingDays: [
        {
            day: { type: String },
            startTime: { type: String },
            endTime: { type: String },
        },
    ],
});

module.exports = mongoose.model("DoctorProfile", doctorProfileSchema);

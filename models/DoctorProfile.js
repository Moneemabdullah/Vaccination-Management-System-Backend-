const mongoose = require("mongoose");

const doctorProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    specialization: { type: String },
    profilePicture: { type: String, default: "default-profile-picture.png" },
    experience: { type: Number },
    qualifications: [{ type: String }],
    certifications: [{ type: String }],
    workingDays: [
        {
            type: String,
        },
    ],
    isApproved: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
});

module.exports =
    mongoose.models.DoctorProfile ||
    mongoose.model("DoctorProfile", doctorProfileSchema);

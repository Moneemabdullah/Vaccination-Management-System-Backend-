const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["admin", "doctor", "patient"],
        required: true,
    },
    name: String,
    email: { type: String, unique: true },
    password: String,
    isApproved: { type: Boolean, default: false }, // For doctors
    rating: { type: Number, default: 0 },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (candidate) {
    return await bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);

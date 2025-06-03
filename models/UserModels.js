const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        roles: {
            type: [String],
            default: ["Doctor", "Patient", "Admin"],
        },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

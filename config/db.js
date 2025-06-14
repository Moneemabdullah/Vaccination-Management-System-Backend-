const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        mongoose.connect(process.env.CONNECTION_STRING);

        console.log(`Mongodb Connected 🎉 🎉`);
    } catch {
        console.log("failed to Connect Database  😑");
        process.exit();
    }
};

module.exports = connectDB;

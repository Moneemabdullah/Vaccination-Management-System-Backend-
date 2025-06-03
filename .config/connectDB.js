const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log(`detabase Connected ✌️ ✌️`);
    } catch {
        console.log("failed to Connect Database  😑");
        process.exit();
    }
};

module.exports = connectDB;

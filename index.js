const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
require("./cron/appointmentReminder"); // 📅 Scheduled job

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.static("public"));

// Connect DB
require("./config/db")();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));
app.use("/api/patient", require("./routes/patientRoutes"));
app.use("/api/landingPage", require("./routes/landingPageRoutes"));

app.get("/", (req, res) => res.send("Vaccination Management API"));

// Error handler
// app.use((req, res) => {
//     res.status(404).sendFile(__dirname + "/public/404.html");
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
    console.log(`🚀 Server running at http://0.0.0.0:${PORT}`)
);

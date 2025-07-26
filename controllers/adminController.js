const mongoose = require("mongoose");
const User = require("../models/User");
const Vaccine = require("../models/Vaccine");
const DoctorProfile = require("../models/DoctorProfile");
const Appointment = require("../models/Appointment");
const sendEmail = require("../utils/sendEmail");
const PatientProfile = require("../models/PatientProfile");

// Approve a doctor
exports.approveDoctor = async (req, res) => {
    try {
        const doctor = await DoctorProfile.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        ).populate("user");

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const userName = doctor.user?.name || "Doctor";
        const userEmail = doctor.user?.email;

        if (!userEmail) {
            return res.status(400).json({ message: "Doctor email not found" });
        }

        const emailContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #e1eeff;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    }
    .header {
      background-color: #002570;
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .header h2 {
      margin: 0;
      font-size: 24px;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 30px 25px;
      color: #333333;
      font-size: 16px;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      margin-top: 20px;
      background-color: #002570;
      color: #ffffff !important;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      transition: background 0.3s ease;
    }
    .button:hover {
      background-color: #001b4d;
    }
    .footer {
      text-align: center;
      font-size: 13px;
      color: #888888;
      padding: 20px;
      background-color: #f9f9f9;
    }
  </style>
</head>
<body">
  <div class="container">
    <div class="header">
      <h2>Doctor Approval Notification</h2>
    </div>
    <div class="content">
      <div class="hero" style="display: flex; align-items: center; justify-content: space-between;">
  <div class="left">
    <p>Dear <strong>${userName}</strong>,</p>
    <p> <strong>Congratulations!</strong> 🎉</p>
  </div>
</div>

      <p>Your application to become a verified doctor on our <strong>Vaccination System</strong> has been <span style="color: green;"><strong>approved</strong></span>.</p>
      <p>You now have access to your doctor dashboard where you can:</p>
      <ul style="padding-left: 20px;">
        <li>Manage your profile</li>
        <li>View and schedule appointments</li>
        <li>Engage with patient care tools</li>
      </ul>
      <a class="button" href="https://your-vaccination-site.com/login">Login to Dashboard</a>
      <p style="margin-top: 25px;">If you have any questions, simply reply to this email — we're here to help!</p>
    </div>
    <div class="footer">
      &copy; 2025 Vaccination System. All rights reserved.
    </div>
  </div>
</body>
</html>


        `;

        await sendEmail(userEmail, "Doctor Application Approved ✅", emailContent);

        res.status(200).json(doctor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a new vaccine
exports.addVaccine = async (req, res) => {
    try {
        const vaccine = new Vaccine(req.body);
        await vaccine.save();
        res.status(201).json(vaccine);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get vaccine by ID
exports.getVaccineById = async (req, res) => {
    try {
        const vaccine = await Vaccine.findById(req.params.id);
        if (!vaccine) {
            return res.status(404).json({ message: "Vaccine not found" });
        }
        res.status(200).json(vaccine);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all doctors (with profile info)
exports.getDoctors = async (req, res) => {
    try {
        const doctors = await DoctorProfile.find().populate("user");
        const approvedDoctors = doctors.filter((doc) => doc.isApproved);
        res.status(200).json(approvedDoctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.removeDoctor = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(req.params.id).session(session);
        if (!user || user.role !== "doctor") {
            return res.status(404).json({ message: "Doctor not found" });
        }

        await DoctorProfile.findOneAndDelete({ user: user._id }).session(session);
        await user.deleteOne({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: "Doctor removed successfully" });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: err.message });
    }
};

// Delete vaccine by ID
exports.deleteVaccine = async (req, res) => {
    try {
        const vaccine = await Vaccine.findByIdAndDelete(req.params.id);
        if (!vaccine) {
            return res.status(404).json({ message: "Vaccine not found" });
        }
        res.status(200).json({ message: "Vaccine deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get dashboard stats
exports.allnumbersControllers = async (req, res) => {
    try {
        const totalPatients = await User.countDocuments({ role: "patient" });
        const totalDoctors = await User.countDocuments({ role: "doctor" });
        const totalVaccines = await Vaccine.countDocuments();
        const totalAppointments = await Appointment.countDocuments();
        const totalUsers = await User.countDocuments();

        res.status(200).json({
            totalPatients,
            totalDoctors,
            totalVaccines,
            totalAppointments,
            totalUsers,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const allUser = await User.find();
        if (!allUser.length) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json(allUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all unapproved doctors (from DoctorProfile)
exports.getUnapprovedDoctors = async (req, res) => {
    try {
        const unapprovedDoctors = await DoctorProfile.find({
            isApproved: false,
        }).populate("user");
        if (!unapprovedDoctors.length) {
            return res
                .status(404)
                .json({ message: "No unapproved doctors found" });
        }
        res.status(200).json(unapprovedDoctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Remove user by ID
exports.removeUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(req.params.id).session(session);
        if (!user) {
            throw new Error("User not found");
        }

        if (user.role === "doctor") {
            await DoctorProfile.findOneAndDelete({ user: user._id }).session(session);
        } else if (user.role === "patient") {
            await PatientProfile.findOneAndDelete({ user: user._id }).session(session);
        }

        await user.deleteOne({ session });

        await session.commitTransaction();
        res.status(200).json({
            message: "User and related profile removed successfully",
        });
    } catch (err) {
        await session.abortTransaction();
        const status = err.message === "User not found" ? 404 : 500;
        res.status(status).json({ error: err.message });
    } finally {
        session.endSession();
    }
};

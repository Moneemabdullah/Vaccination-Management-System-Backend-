const express = require("express");
const router = express.Router();
const {
    getAppointments,
    updateAppointmentStatus,
    getPatientMedicalHistory,
    updateDocProfile,
} = require("../controllers/doctorController");
const { getDoctorById } = require("../controllers/landingPagecontroller");

// const { authMiddleware, doctorOnly } = require("../middleware/authMiddleware");

// router.use(authMiddleware, doctorOnly);

// GET all appointments
router.get("/appointments/:id", getAppointments);

// PUT approve/reject appointment
router.put("/appointment/:id", updateAppointmentStatus);

// GET patient medical history
router.get("/patient-history/:patientId", getPatientMedicalHistory);
// profile of doctor
router.get("/Profile/:id", getDoctorById);
router.put("/updateProfile/:id", updateDocProfile);

module.exports = router;

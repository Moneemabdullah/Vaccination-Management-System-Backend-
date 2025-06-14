const express = require("express");
const router = express.Router();
const {
    getAppointments,
    updateAppointmentStatus,
    getPatientMedicalHistory,
} = require("../controllers/doctorController");

const { authMiddleware, doctorOnly } = require("../middleware/authMiddleware");

router.use(authMiddleware, doctorOnly);

// GET all appointments
router.get("/appointments", getAppointments);

// PUT approve/reject appointment
router.put("/appointment/:id", updateAppointmentStatus);

// GET patient medical history
router.get("/patient-history/:patientId", getPatientMedicalHistory);

module.exports = router;

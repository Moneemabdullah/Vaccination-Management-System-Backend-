const express = require("express");
const router = express.Router();
const {
    bookAppointment,
    getMyAppointments,
    updateMedicalHistory,
    getMyMedicalHistory,
} = require("../controllers/patientController");

// const { authMiddleware, patientOnly } = require("../middleware/authMiddleware");

// router.use(authMiddleware, patientOnly);

router.post("/appointment", bookAppointment);
router.get("/appointments", getMyAppointments);
router.put("/medical-history", updateMedicalHistory);
router.get("/medical-history", getMyMedicalHistory);

module.exports = router;

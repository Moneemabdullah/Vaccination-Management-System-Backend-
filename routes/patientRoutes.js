const express = require("express");
const router = express.Router();
const {
    bookAppointment,
    getMyAppointments,
    getApprovedDoctors,
    getVaccines,
    updateMedicalHistory,
    getMyMedicalHistory,
} = require("../controllers/patientController");

const { authMiddleware, patientOnly } = require("../middleware/authMiddleware");

router.use(authMiddleware, patientOnly);

router.post("/appointment", bookAppointment);
router.get("/appointments", getMyAppointments);
router.get("/doctors", getApprovedDoctors);
router.get("/vaccines", getVaccines);
router.put("/medical-history", updateMedicalHistory);
router.get("/medical-history", getMyMedicalHistory);

module.exports = router;

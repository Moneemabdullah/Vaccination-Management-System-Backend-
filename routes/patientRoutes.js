const express = require("express");
const router = express.Router();
const {
    bookAppointment,
    getMyAppointments,
    updateMedicalHistory,
    getMedicalHistoryByUserId,
    getPatientProfileById,
    updateMyProfile,
} = require("../controllers/patientController");

// const { authMiddleware, patientOnly } = require("../middleware/authMiddleware");

// // Protect all routes under this router for logged-in patients only
// router.use(authMiddleware, patientOnly);

router.post("/appointment", bookAppointment);
router.get("/appointments", getMyAppointments);
router.post("/medical-history/update/:id", updateMedicalHistory);
router.get("/medical-history/:userId", getMedicalHistoryByUserId);
router.get("/getprofile/:id", getPatientProfileById);
router.put("/update-profile", updateMyProfile); // Changed from GET to PUT

module.exports = router;

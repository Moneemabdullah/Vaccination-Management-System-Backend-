const express = require("express");
const router = express.Router();
const {
    bookAppointment,
    getMyAppointments,
    updateMedicalHistory,
    getMyMedicalHistory,
    getPatientProfileById,
    updateMyProfile,
} = require("../controllers/patientController");

// const { authMiddleware, patientOnly } = require("../middleware/authMiddleware");

// router.use(authMiddleware, patientOnly);

router.post("/appointment", bookAppointment);
router.get("/appointments", getMyAppointments);
router.put("/medical-history", updateMedicalHistory);
router.get("/medical-history", getMyMedicalHistory);
router.get("/getprofile/:id", getPatientProfileById);
router.get("/update-profile/:id", updateMyProfile); // Assuming this is for updating profile
module.exports = router;

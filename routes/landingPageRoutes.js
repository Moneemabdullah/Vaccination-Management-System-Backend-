const express = require("express");
const router = express.Router();

const {
    getApprovedDoctors,
    getVaccines,
    herocardController,
    getDoctorById,
    getUserbyId,
} = require("../controllers/landingPagecontroller");

router.get("/doctors", getApprovedDoctors);
router.get("/vaccines", getVaccines);
router.get("/heroCard", herocardController);
router.get("/doctor/:id", getDoctorById);
router.get("/user/:id", getUserbyId);

module.exports = router;

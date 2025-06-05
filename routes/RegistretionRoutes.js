const express = require("express");
const router = express.Router();

const {
    registerDoctor,
} = require("../controllers/DoctorRegistrationController");

const {
    registerPatient,
} = require("../controllers/PaitentRegistretionController");

router.post("/doctor", registerDoctor);
router.post("/patient", registerPatient);

module.exports = router;
// This file defines the routes for doctor and patient registration.

const express = require("express");
const router = express.Router();

const {
    getApprovedDoctors,
    getVaccines,
    herocardController,
} = require("../controllers/landingPagecontroller");

router.get("/doctors", getApprovedDoctors);
router.get("/vaccines", getVaccines);
router.get("/heroCard", herocardController);

module.exports = router;

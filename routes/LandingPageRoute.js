const express = require("express");
const router = express.Router();

const {
    cardSectionController,
    allVaccinCardController,
    allDoctorsController,
} = require("../controllers/LandingPageControllers");

// taking routes for card section
router.get("/cardSection", cardSectionController);
router.get("/allvaccinCard", allVaccinCardController);
router.get("allDoctors", allDoctorsController);

module.exports = router;

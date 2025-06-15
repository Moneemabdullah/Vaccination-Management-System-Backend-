const express = require("express");
const router = express.Router();

const {
    getApprovedDoctors,
    getVaccines,
} = require("../controllers/landingPagecontroller");

router.get("/doctors", getApprovedDoctors);
router.get("/vaccines", getVaccines);

module.exports = router;

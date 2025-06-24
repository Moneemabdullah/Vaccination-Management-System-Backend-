const express = require("express");
const router = express.Router();
const {
    approveDoctor,
    addVaccine,
    getDoctors,
    removeDoctor,
    deleteVaccine,
    allnumbersControllers,
    getDoctorById,
    getVaccineById,
} = require("../controllers/adminController");
// const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

// router.use(authMiddleware, adminOnly);

router.put("/approve-doctor/:id", approveDoctor);
router.delete("/remove-doctor/:id", removeDoctor);
router.get("/doctors", getDoctors);
router.get("/doctor/:id", getDoctorById);

// Vaccine
router.post("/add-vaccine", addVaccine);
router.delete("/delete-vaccine/:id", deleteVaccine);
router.get("/get-a-vaccine/:id", getVaccineById);
router.get;

// Dashboard numbers
router.get("/all-numbers", allnumbersControllers);
module.exports = router;

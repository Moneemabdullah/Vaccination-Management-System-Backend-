const express = require("express");
const router = express.Router();
const {
    approveDoctor,
    addVaccine,
    getDoctors,
    removeDoctor,
    deleteVaccine,
    allnumbersControllers,
} = require("../controllers/adminController");
// const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

// router.use(authMiddleware, adminOnly);

router.put("/approve-doctor/:id", approveDoctor);
router.delete("/remove-doctor/:id", removeDoctor);
router.get("/doctors", getDoctors);

// Vaccine
router.post("/add-vaccine", addVaccine);
router.delete("/delete-vaccine/:id", deleteVaccine);

// Dashboard numbers
router.get("/all-numbers", allnumbersControllers);
module.exports = router;

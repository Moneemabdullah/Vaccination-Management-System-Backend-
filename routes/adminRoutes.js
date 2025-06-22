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
router.post("/vaccine", addVaccine);
router.delete("/vaccine/:id", deleteVaccine);

router.get("/doctors", getDoctors);
router.delete("/remove-doctor/:id", removeDoctor);
router.get("/all-numbers", allnumbersControllers);

module.exports = router;

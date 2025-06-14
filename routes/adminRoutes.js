const express = require("express");
const router = express.Router();
const {
    approveDoctor,
    addVaccine,
    getDoctors,
} = require("../controllers/adminController");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

router.use(authMiddleware, adminOnly);

router.put("/approve-doctor/:id", approveDoctor);
router.post("/vaccine", addVaccine);
router.get("/doctors", getDoctors);

module.exports = router;

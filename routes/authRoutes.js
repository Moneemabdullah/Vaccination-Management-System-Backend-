const express = require("express");
const {
    register,
    login,
    docRegister,
} = require("../controllers/authController");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

router.post("/register", register);
router.post("/doc/register", upload.single("profilePhoto"), docRegister);
router.post("/login", login);

module.exports = router;

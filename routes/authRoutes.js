const express = require("express");
const router = express.Router();

const {
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

const {
  forgotPasswordRules,
  resetPasswordRules,
  validate
} = require("../middleware/validators");

// Sanitize & Validate → then Controller
router.post("/forgot-password", forgotPasswordRules, validate, forgotPassword);

router.post("/reset-password", resetPasswordRules, validate, resetPassword);

module.exports = router;
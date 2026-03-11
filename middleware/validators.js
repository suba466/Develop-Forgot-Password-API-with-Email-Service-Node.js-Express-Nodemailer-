const { body, validationResult } = require("express-validator");

/* ===========================
   Sanitize & Validate Middleware
   =========================== */

// Forgot Password - validate email
const forgotPasswordRules = [
  body("email")
    .trim()                          // Remove extra spaces
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email")
    .normalizeEmail()                // Converts to lowercase & cleans up
];

// Reset Password - validate token + new password
const resetPasswordRules = [
  body("token")
    .trim()
    .notEmpty().withMessage("Token is required")
    .escape(),                       // Remove dangerous HTML characters

  body("newPassword")
    .trim()
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];

/* ===========================
   Error Handler Middleware
   =========================== */

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

  next(); // All clean — move to controller
};

module.exports = {
  forgotPasswordRules,
  resetPasswordRules,
  validate
};

const { body, validationResult } = require("express-validator");

const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const analyzeResumeValidation = [
  body("resumeText")
    .isString()
    .notEmpty()
    .withMessage("Resume text is required for analysis"),
];

const analyzeJobMatchValidation = [
  body("resumeText")
    .isString()
    .notEmpty()
    .withMessage("Resume text is required"),
  body("jobDescription")
    .isString()
    .notEmpty()
    .withMessage("Job description is required"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  analyzeResumeValidation,
  analyzeJobMatchValidation,
  validate,
};


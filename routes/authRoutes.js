const express = require("express");
const { check, validationResult } = require("express-validator");
const { register, login } = require("../controllers/authController");
const { array } = require("joi");
const router = express.Router();

// Register route
router.post(
  "/register",
  [
    check("username")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  register
);

// Login route
router.post(
  "/login",
  [
    check("username")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  login
);

module.exports = router;

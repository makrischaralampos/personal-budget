const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { createUser, findUserByUsername } = require("../models/userModel");
const AppError = require("../utils/AppError");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// Register a new user
const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    if (findUserByUsername(username)) {
      return next(new AppError("Username is already taken", 400));
    }

    // Create a new user
    const user = await createUser(username, password);

    res.status(201).json({
      message: "User registered successfully",
      userId: user.id,
    });
  } catch (error) {
    next(error);
  }
};

// Login a user
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find the user
    const user = findUserByUsername(username);
    if (!user) {
      return next(new AppError("Invalid credentials", 401));
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError("Invalid credentials", 401));
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Protect routes
const protect = (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user to request object
    req.user = { id: decoded.id };

    next();
  } catch (error) {
    next(new AppError("Authentication failed", 401));
  }
};

module.exports = {
  register,
  login,
  protect,
};

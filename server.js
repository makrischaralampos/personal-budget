require("dotenv").config(); // Load environment variables from .env file

// Import the Express library
const express = require("express");
const envelopeRoutes = require("./routes/envelopeRoutes");
const globalErrorHandler = require("./middlewares/errorHandler");
const AppError = require("./utils/AppError");

// Create an instance of an Express app
const app = express();

// Define the port number
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Use the envelope routes
app.use("/envelopes", envelopeRoutes);

// Basic GET route to confirm server is running
app.get("/", (req, res) => {
  res.send("Hello, World");
});

// 404 route for undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

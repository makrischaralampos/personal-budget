// Import the Express library
const express = require("express");
const envelopeRoutes = require("./routes/envelopeRoutes");
const errorHandler = require("./middlewares/errorHandler");

// Create an instance of an Express app
const app = express();

// Define the port number
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Use the envelope routes
app.use("/envelopes", envelopeRoutes);

// Basic GET route to confirm server is running
app.get("/", (req, res) => {
  res.send("Hello, World");
});

// Use the error-handling middleware (this should be the last middleware)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

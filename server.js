// Import the Express library
const express = require("express");

// Create an instance of an Express app
const app = express();

// Define the port number
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Global variables to store envelopes and total budget
let envelopes = [];
let totalBudget = 0;

// POST endpoint to create a new envelope
app.post("/envelopes", (req, res) => {
  const { title, budget } = req.body;

  // Validate request data
  if (!title || typeof budget !== "number" || budget < 0) {
    return res.status(400).json({ error: "Invalid envelope data" });
  }

  // Generate a new ID for the envelope
  const newId = envelopes.length + 1;

  // Create the new envelope object
  const newEnvelope = {
    id: newId,
    title,
    budget,
  };

  // Add the new envelope to the array and update the total budget
  envelopes.push(newEnvelope);
  totalBudget += budget;

  // Send a success response
  res.status(201).json({
    message: "Envelope created successfully",
    envelope: newEnvelope,
  });
});

// GET endpoint to retrieve all envelopes
app.get("/envelopes", (req, res) => {
  res.status(200).json({
    envelopes: envelopes,
  });
});

// Basic GET route to confirm server is running
app.get("/", (req, res) => {
  res.send("Hello, World");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

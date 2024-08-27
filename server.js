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

// GET endpoint to retrieve a specific envelope by ID
app.get("/envelopes/:id", (req, res) => {
  const { id } = req.params;

  // Find the envelope with the corresponding ID
  const envelope = envelopes.find((env) => env.id === parseInt(id));

  // If the envelope is not found, return a 404 error
  if (!envelope) {
    return res.status(404).json({ error: "Envelope not found" });
  }

  // Return the found envelope
  res.status(200).json(envelope);
});

// PUT endpoint to update a specific envelope by ID
app.put("/envelopes/:id", (req, res) => {
  const { id } = req.params;
  const { title, budget, deductAmount } = req.body;

  // Find the envelope with the corresponding ID
  const envelope = envelopes.find((env) => env.id === parseInt(id));

  // If the envelope is not found, return a 404 error
  if (!envelope) {
    return res.status(404).json({ error: "Envelope not found" });
  }

  // Update the title if provided
  if (title) {
    envelope.title = title;
  }

  // Update the budget if provided
  if (typeof budget === "number" && budget >= 0) {
    // Adjust the total budget when updating the budget
    totalBudget -= envelope.budget;
    envelope.budget = budget;
    totalBudget += budget;
  }

  // Deduct amount from the envelope's budget if provided
  if (typeof deductAmount === "number" && deductAmount > 0) {
    if (envelope.budget < deductAmount) {
      return res
        .status(400)
        .json({ error: "Insufficient funds in the envelope" });
    }

    envelope.budget -= deductAmount;
    totalBudget -= deductAmount;
  }

  // Send a success response with the updated envelope
  res.status(200).json({
    message: "Envelope updated successfully",
    envelope: envelope,
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

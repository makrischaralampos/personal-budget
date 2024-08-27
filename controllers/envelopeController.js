// Global variables to store envelopes and total budget
let envelopes = [];
let totalBudget = 0;

// Get all envelopes
const getAllEnvelopes = (req, res) => {
  res.status(200).json({
    envelopes: envelopes,
  });
};

// Get an envelope by ID
const getEnvelopeById = (req, res) => {
  const { id } = req.params;

  // Find the envelope with the corresponding ID
  const envelope = envelopes.find((env) => env.id === parseInt(id));

  // If the envelope is not found, return a 404 error
  if (!envelope) {
    return res.status(404).json({ error: "Envelope not found" });
  }

  // Return the found envelope
  res.status(200).json(envelope);
};

// Create a new envelope
const createEnvelope = (req, res) => {
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
};

// Update an envelope
const updateEnvelope = (req, res) => {
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
};

// Delete an envelope
const deleteEnvelope = (req, res) => {
  const { id } = req.params;

  // Find the envelope to be deleted
  const envelopeIndex = envelopes.findIndex((env) => env.id === parseInt(id));

  // If the envelope is not found, return a 404 error
  if (envelopeIndex === -1) {
    return res.status(404).json({ error: "Envelope not found" });
  }

  // Adjust the total budget before deleting
  totalBudget -= envelopes[envelopeIndex].budget;

  // Remove the envelope from the array
  envelopes = envelopes.filter((env) => env.id !== parseInt(id));

  // Send a success response
  res.status(200).json({ message: "Envelope deleted successfully" });
};

// Transfer budget between envelopes
const transferBudget = (req, res) => {
  const { from, to } = req.params;
  const { amount } = req.body;

  // Validate the amount
  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "Invalid transfer amount" });
  }

  // Find the source and destination envelopes
  const fromEnvelope = envelopes.find((env) => env.id === parseInt(from));
  const toEnvelope = envelopes.find((env) => env.id === parseInt(to));

  // Check if both envelopes exist
  if (!fromEnvelope || !toEnvelope) {
    return res.status(404).json({ error: "One or both envelopes not found" });
  }

  // Check if the source envelope has enough funds
  if (fromEnvelope.budget < amount) {
    return res
      .status(400)
      .json({ error: "Insufficient funds in the source envelope" });
  }

  // Perform the transfer
  fromEnvelope.budget -= amount;
  toEnvelope.budget += amount;

  // Send a success response with the updated envelopes
  res.status(200).json({
    message: "Transfer completed successfully",
    fromEnvelope: fromEnvelope,
    toEnvelope: toEnvelope,
  });
};

module.exports = {
  getAllEnvelopes,
  getEnvelopeById,
  createEnvelope,
  updateEnvelope,
  deleteEnvelope,
  transferBudget,
};

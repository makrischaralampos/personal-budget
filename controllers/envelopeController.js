const AppError = require("../utils/AppError");
const {
  createEnvelopeSchema,
  updateEnvelopeSchema,
  transferBudgetSchema,
} = require("../validation/envelopeValidation");

// Global variables to store envelopes and total budget
let envelopes = [];
let totalBudget = 0;

// Get all envelopes
const getAllEnvelopes = (req, res, next) => {
  try {
    res.status(200).json({
      envelopes: envelopes,
    });
  } catch (error) {
    next(error);
  }
};

// Get an envelope by ID
const getEnvelopeById = (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the envelope with the corresponding ID
    const envelope = envelopes.find((env) => env.id === parseInt(id));

    // If the envelope is not found, return a 404 error
    if (!envelope) {
      return next(new AppError("Envelope not found", 404));
    }

    // Return the found envelope
    res.status(200).json(envelope);
  } catch (error) {
    next(error);
  }
};

// Create a new envelope
const createEnvelope = (req, res, next) => {
  try {
    const { error, value } = createEnvelopeSchema.validate(req.body);

    // Validate request data
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const { title, budget } = value;
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
  } catch (error) {
    next(error);
  }
};

// Update an envelope
const updateEnvelope = (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = updateEnvelopeSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    // Find the envelope with the corresponding ID
    const envelope = envelopes.find((env) => env.id === parseInt(id));

    // If the envelope is not found, return a 404 error
    if (!envelope) {
      return next(new AppError("Envelope not found", 404));
    }

    const { title, budget, deductAmount } = value;

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
        return next(new AppError("Insufficient funds in the envelope", 400));
      }

      envelope.budget -= deductAmount;
      totalBudget -= deductAmount;
    }

    // Send a success response with the updated envelope
    res.status(200).json({
      message: "Envelope updated successfully",
      envelope: envelope,
    });
  } catch (error) {
    next(error);
  }
};

// Delete an envelope
const deleteEnvelope = (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the envelope to be deleted
    const envelopeIndex = envelopes.findIndex((env) => env.id === parseInt(id));

    // If the envelope is not found, return a 404 error
    if (envelopeIndex === -1) {
      return next(new AppError("Envelope not found", 404));
    }

    // Adjust the total budget before deleting
    totalBudget -= envelopes[envelopeIndex].budget;

    // Remove the envelope from the array
    envelopes = envelopes.filter((env) => env.id !== parseInt(id));

    // Send a success response
    res.status(200).json({ message: "Envelope deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Transfer budget between envelopes
const transferBudget = (req, res, next) => {
  try {
    const { from, to } = req.params;
    const { error, value } = transferBudgetSchema.validate(req.body);

    // Validate the amount
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    // Find the source and destination envelopes
    const fromEnvelope = envelopes.find((env) => env.id === parseInt(from));
    const toEnvelope = envelopes.find((env) => env.id === parseInt(to));

    // Check if both envelopes exist
    if (!fromEnvelope || !toEnvelope) {
      return next(new AppError("One or both envelopes are not found", 404));
    }

    const { amount } = value;

    // Check if the source envelope has enough funds
    if (fromEnvelope.budget < amount) {
      return next(
        new AppError("Insufficient funds in the source envelope", 400)
      );
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
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEnvelopes,
  getEnvelopeById,
  createEnvelope,
  updateEnvelope,
  deleteEnvelope,
  transferBudget,
};

const express = require("express");
const {
  getAllEnvelopes,
  getEnvelopeById,
  createEnvelope,
  updateEnvelope,
  deleteEnvelope,
  transferBudget,
} = require("../controllers/envelopeController");

const router = express.Router();

// Define routes and attach envelope controllers
router.get("/", getAllEnvelopes);
router.get("/:id", getEnvelopeById);
router.post("/", createEnvelope);
router.put("/:id", updateEnvelope);
router.delete("/:id", deleteEnvelope);
router.post("/transfer/:from/:to", transferBudget);

module.exports = router;

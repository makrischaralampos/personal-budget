const express = require("express");
const { protect } = require("../controllers/authController");
const {
  getAllEnvelopes,
  getEnvelopeById,
  createEnvelope,
  updateEnvelope,
  deleteEnvelope,
  transferBudget,
} = require("../controllers/envelopeController");

const router = express.Router();

router.use(protect); // Protect all routes

// Define routes and attach envelope controllers
router.get("/", getAllEnvelopes);
router.get("/:id", getEnvelopeById);
router.post("/", createEnvelope);
router.put("/:id", updateEnvelope);
router.delete("/:id", deleteEnvelope);
router.post("/transfer/:from/:to", transferBudget);

module.exports = router;

const Joi = require("joi");

const createEnvelopeSchema = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  budget: Joi.number().positive().required(),
});

const updateEnvelopeSchema = Joi.object({
  title: Joi.string().min(3).max(50),
  budget: Joi.number().positive(),
  deductAmount: Joi.number().positive(),
});

const transferBudgetSchema = Joi.object({
  amount: Joi.number().positive().required(),
});

module.exports = {
  createEnvelopeSchema,
  updateEnvelopeSchema,
  transferBudgetSchema,
};

import mongoose from 'mongoose';
import Joi from 'joi';

const createUserInputSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
const loginInputSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const objectIdSchema = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'ObjectId validation');

const deleteUSerSchema = Joi.object({
  userId: objectIdSchema.required(),
  password: Joi.string().min(8).required(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  oldPassword: Joi.string().min(8).max(20).required(),
  newPassword: Joi.string().min(8).max(20).required(),
});

const createCompanySchema = Joi.object({
  name: Joi.string().min(3).max(50),
  domain: Joi.string().min(3).max(50),
  adminName: Joi.string().lowercase().min(3).max(50),
  adminEmail: Joi.string().email(),
  adminPassword: Joi.string(),
});

export {
  createUserInputSchema,
  loginInputSchema,
  objectIdSchema,
  deleteUSerSchema,
  updateSchema,
  createCompanySchema,
};

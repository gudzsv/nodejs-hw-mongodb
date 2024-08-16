import Joi from 'joi';
import { JOI_VALIDATION_MSG, VALIDATION_LENGTH } from '../constants/index.js';
const { MIN_LENGTH, MAX_LENGTH } = VALIDATION_LENGTH;
const { MIN, MAX, STRING, EMAIL } = JOI_VALIDATION_MSG;

export const registerUserSchema = Joi.object({
  name: Joi.string().min(MIN_LENGTH).max(MAX_LENGTH).required().messages({
    'string.base': STRING,
    'string.min': MIN,
    'string.max': MAX,
  }),
  email: Joi.string()
    .min(MIN_LENGTH)
    .max(MAX_LENGTH)
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': STRING,
      'string.min': MIN,
      'string.max': MAX,
      'string.email': EMAIL,
    }),
  password: Joi.string().min(MIN_LENGTH).max(MAX_LENGTH).required().messages({
    'string.base': STRING,
    'string.min': MIN,
    'string.max': MAX,
  }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string()
    .min(MIN_LENGTH)
    .max(MAX_LENGTH)
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': STRING,
      'string.min': MIN,
      'string.max': MAX,
      'string.email': EMAIL,
    }),
  password: Joi.string().min(MIN_LENGTH).max(MAX_LENGTH).required().messages({
    'string.min': MIN,
    'string.max': MAX,
  }),
});

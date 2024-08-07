import Joi from 'joi';
import { JOI_VALIDATION_MSG, VALIDATION_LENGTH } from '../constants/index.js';

const { MIN, MAX, ONE_OF, REQUIRED, STRING, BOOLEAN, PHONE_NUMBER } =
  JOI_VALIDATION_MSG;

const { MIN_LENGTH, MAX_LENGTH } = VALIDATION_LENGTH;

const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;

export const createContactSchema = Joi.object({
  name: Joi.string().min(MIN_LENGTH).max(MAX_LENGTH).required().messages({
    'string.min': MIN,
    'string.max': MAX,
    'any.required': REQUIRED,
  }),
  phoneNumber: Joi.string()
    .min(MIN_LENGTH)
    .max(MAX_LENGTH)
    .pattern(phoneNumberPattern)
    .required()
    .messages({
      'string.base': STRING,
      'string.min': MIN,
      'string.max': MAX,
      'string.pattern.base': PHONE_NUMBER,
      'any.required': REQUIRED,
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
  isFavorite: Joi.boolean().default(false).message({ 'boolean.base': BOOLEAN }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .default('personal')
    .required()
    .messages({
      'string.base': STRING,
      'string.valid': ONE_OF,
      'any.required': REQUIRED,
    }),
});

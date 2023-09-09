import joi from 'joi';
import { validator, validatorType } from './index';

export const createNewsValidator = validator(joi.object().keys({
  content: joi.string().required(),
  thumbnail: joi.string().required(),
  description: joi.string().required().max(500),
  descriptionSEO: joi.string().required().max(500),
  nameNews: joi.string().required().max(100),
  slug: joi.string().required().max(100),
  title: joi.string().required().max(100),
  outstanding: joi.number().required()
}), validatorType.BODY);

export const updateNewsValidator = validator(joi.object().keys({
  id: joi.number().required(),
  content: joi.string(),
  thumbnail: joi.string(),
  description: joi.string().max(500),
  descriptionSEO: joi.string().max(500),
  nameNews: joi.string().max(100),
  slug: joi.string().max(100),
  title: joi.string().max(100),
  outstanding: joi.number(),
  status: joi.number()
}), validatorType.BODY);

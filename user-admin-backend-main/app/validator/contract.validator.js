import joi from 'joi';
import { validator, validatorType } from './index';

export const createContractValidator = validator(joi.object().keys({
  email: joi.string().required().max(256),
  fullName: joi.string().required().max(256),
  phoneNumber: joi.string().required().max(256),
  content: joi.string().allow(null).allow('')
}), validatorType.BODY);

export const updateContractValidator = validator(joi.object().keys({
  id: joi.number().required(),
  status: joi.number().required()
}), validatorType.BODY);

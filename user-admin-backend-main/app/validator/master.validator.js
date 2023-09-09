import joi from 'joi';
import { validator, validatorType } from './index';

export const createMasterValidator = validator(joi.object().keys({
  nameMaster: joi.string().required().max(256),
  name: joi.string().required().max(256),
  note: joi.string().allow(null, '')
}), validatorType.BODY);

export const updateMasterValidator = validator(joi.object().keys({
  id: joi.number().required(),
  idMaster: joi.number().required(),
  nameMaster: joi.string().required().max(256),
  name: joi.string().required().max(256),
  note: joi.string().allow(null, '')
}), validatorType.BODY);

export const deleteMasterValidator = validator(joi.object().keys({
  id: joi.number().required(),
  idMaster: joi.number().required()
}), validatorType.BODY);

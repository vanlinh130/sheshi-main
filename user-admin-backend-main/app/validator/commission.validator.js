import joi from 'joi';
import { validator, validatorType } from './index';

export const createCommissionValidator = validator(
  joi.object().keys({
    commissionName: joi.string().max(256).required(),
    type: joi.number().required(),
    percent: joi.number().allow(null, ""),
    conditions: joi.string().allow(null, ""),
    note: joi.string().allow(null, "")
  }),
  validatorType.BODY
);
export const createCommissionLevelValidator = validator(
  joi.object().keys({
    idLevel: joi.number().required(),
    idCommissions: joi.array().min(1).required()
  }),
  validatorType.BODY
);

export const updateCommissionValidator = validator(
  joi.object().keys({
    id: joi.number().required(),
    commissionName: joi.string().max(256).required(),
    type: joi.number().required(),
    percent: joi.number().allow(null, ""),
    conditions: joi.string().allow(null, ""),
    note: joi.string().allow(null, "")
  }),
  validatorType.BODY
);

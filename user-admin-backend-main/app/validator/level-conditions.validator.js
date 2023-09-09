import joi from 'joi';
import { validator, validatorType } from './index';

export const createLevelConditionsValidator = validator(
  joi.object().keys({
    idLevel: joi.number().required(),
    value: joi.number().required(),
    type: joi.number().required(),
    masterUnit: joi.number().allow(null, ""),
    unit: joi.number().allow(null, ""),
    amountMonth: joi.number().allow(null, ""),
    note: joi.string().allow(null, "")
  }),
  validatorType.BODY
);
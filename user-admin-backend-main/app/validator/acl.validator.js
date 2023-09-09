import joi from 'joi';
import { validator, validatorType } from './index';

export const deleteRoleModuleValidator = validator(
  joi.object().keys({
    actionsId: joi.array().required(),
    groupId: joi.number().required()
  }),
  validatorType.BODY
);

export const createRoleModuleValidator = validator(
  joi.object().keys({
    actionsId: joi.array().required(),
    groupId: joi.number().required()
  }),
  validatorType.BODY
);

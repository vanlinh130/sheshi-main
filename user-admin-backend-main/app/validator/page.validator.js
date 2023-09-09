import joi from 'joi';
import { validator, validatorType } from './index';

export const updateContactPageValidator = validator(joi.object().keys({
  infomationAddressFooter: joi.object().required(),
  infomationContact: joi.object().required()
}), validatorType.BODY);

export const updateContentSlidePageValidator = validator(joi.object().keys({
  listContent: joi.array(),
  listImage: joi.array()
}), validatorType.BODY);

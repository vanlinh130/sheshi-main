import joi from 'joi';
import { validator, validatorType } from './index';
import { MAX_LENGTH_PHONE, MIN_LENGTH_PHONE } from '../constants/common.constant';

export const updateTypeValidator = validator(joi.object().keys({
  type: joi.number().required()
}), validatorType.BODY);

export const updateUserProfileValidator = validator(joi.object().keys({
  fullName: joi.string().trim().max(255).required(),
  phoneCode: joi.number().allow('', null),
  phoneNumber: joi.string().trim().allow('', null).min(MIN_LENGTH_PHONE).max(MAX_LENGTH_PHONE),
  address: joi.string().trim().max(255).allow('', null),
  cityCode: joi.number().allow('', null),
  districtCode: joi.number().allow('', null),
  wardCode: joi.number().allow('', null),
  avatar: joi.string().trim().allow('', null)
}), validatorType.BODY);

export const registUserAddressValidator = validator(joi.object().keys({
  address: joi.string().trim().max(255).required(),
  cityCode: joi.number().required(),
  districtCode: joi.number().required(),
  wardCode: joi.number().required(),
  telephone: joi.string().trim().allow('', null).min(MIN_LENGTH_PHONE).max(MAX_LENGTH_PHONE)
}), validatorType.BODY);

export const withdrawBonusValidator = validator(joi.object().keys({
  priceBonus: joi.number().required(),
  userId: joi.number().required(),
  type: joi.number().required()
}), validatorType.BODY);

export const setLevelUserValidator = validator(joi.object().keys({
  id: joi.number().required(),
  level: joi.number().allow('', null),
  role: joi.number().allow('', null)
}), validatorType.BODY);

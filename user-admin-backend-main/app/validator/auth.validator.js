import joi from 'joi';
import { OTP_CODE_LENGTH } from '../constants/common.constant';
import { REGEX } from '../util/regex.util';
import { validator, validatorType } from './index';

export const loginValidator = validator(joi.object().keys({
  email: joi.string().email().required(),
  password: joi.string().max(256).required()
}), validatorType.BODY);

export const registerUserValidator = validator(joi.object().keys({
  fullName: joi.string().trim().allow(null).allow(''),
  email: joi.string().trim().email().regex(REGEX.email, 'email').max(256).required(),
  password: joi.string().trim().max(256).required(),
  referralCode: joi.string().allow(null).allow('')
}), validatorType.BODY);

export const resetPasswordValidator = validator(joi.object().keys({
  email: joi.string().email().regex(REGEX.email, 'email').required(),
  otpCode: joi.string().trim().length(OTP_CODE_LENGTH).required(),
  password: joi.string().required(),
  rePassword: joi.string().required()
}), validatorType.BODY);
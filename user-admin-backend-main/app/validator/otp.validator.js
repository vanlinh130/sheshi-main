import joi from 'joi';
import { OTP_CODE_TYPE } from '../constants/common.constant';
import { REGEX } from '../util/regex.util';
import { validator, validatorType } from './index';

export const sendOtpValidator = validator(joi.object().keys({
  email: joi.string().trim().email().regex(REGEX.email, 'email').required(),
  type: joi.string().valid(...Object.values(OTP_CODE_TYPE)).required()
}), validatorType.BODY);
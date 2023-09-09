import joi from 'joi';
import { validator, validatorType } from './index';
import { MAX_LENGTH_PHONE, MIN_LENGTH_PHONE } from '../constants/common.constant';

export const newOrderValidator = validator(
  joi.object().keys({
    userId: joi.number().allow("", null),
    email: joi.string().trim().max(256).required(),
    fullName: joi.string().trim().max(256),
    deliveryMethod: joi.string().max(1).required(),
    paymentMethod: joi.string().max(1).required(),
    listProduct: joi.array().required(),
    districtAndCity: joi.object().allow(null),
    telephone: joi
      .string()
      .trim()
      .allow("", null)
      .min(MIN_LENGTH_PHONE)
      .max(MAX_LENGTH_PHONE),
    address: joi.string().trim().max(256).allow("", null),
    cityCode: joi.number().allow("", null),
    fee: joi.number().allow("", null),
    districtCode: joi.number().allow("", null),
    wardCode: joi.number().allow("", null),
    referralCode: joi.string().allow("", null),
    note: joi.string().trim().allow("", null),
  }),
  validatorType.BODY
);

export const updateStatusOrderValidator = validator(joi.object().keys({
  status: joi.number().required(),
  productDetail: joi.array().allow(null)
}), validatorType.BODY);
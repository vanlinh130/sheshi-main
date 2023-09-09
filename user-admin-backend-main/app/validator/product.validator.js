import joi from 'joi';
import { validator, validatorType } from './index';

export const createCategoryValidator = validator(joi.object().keys({
  name: joi.string().max(256).required(),
  categorySlug: joi.string().max(256).allow(null, ''),
  description: joi.string().allow(null, ''),
  image: joi.string().allow(null, ''),
  note: joi.string().allow(null, '')
}), validatorType.BODY);

export const updateCategoryValidator = validator(joi.object().keys({
  id: joi.number().required(),
  name: joi.string().max(256).required(),
  categorySlug: joi.string().max(256).allow(null, ''),
  description: joi.string().allow(null, ''),
  image: joi.string().allow(null, ''),
  note: joi.string().allow(null, ''),
  status: joi.number()
}), validatorType.BODY);

export const createProductValidator = validator(joi.object().keys({
  categoryId: joi.number().required(),
  discountId: joi.number().allow(null, ''),
  productSlug: joi.string().max(256).allow(null, ''),
  name: joi.string().required().max(256),
  nameVi: joi.string().max(256).allow(null, ''),
  acronym: joi.string().max(256).allow(null, ''),
  typeProduct: joi.string().allow(null, ''),
  purposeUse: joi.string().allow(null, ''),
  description: joi.string().allow(null, ''),
  branchId: joi.number().allow(null, ''),
  uses: joi.string().allow(null, ''),
  element: joi.string().allow(null, ''),
  guide: joi.string().allow(null, ''),
  outstanding: joi.number().required(),
  originId: joi.number().allow(null, ''),
  colorId: joi.number().allow(null, ''),
  expiry: joi.string().allow(null, ''),
  policy: joi.string().allow(null, ''),
  mainImage: joi.string().required(),
  subImage: joi.array().allow(null, ''),
  productDetail: joi.array().required()
}), validatorType.BODY);

export const updateProductValidator = validator(joi.object().keys({
  id: joi.number().required(),
  categoryId: joi.number().required(),
  discountId: joi.number().allow(null, ''),
  branchId: joi.number().allow(null, ''),
  originId: joi.number().allow(null, ''),
  colorId: joi.number().allow(null, ''),
  productSlug: joi.string().max(256).allow(null, ''),
  name: joi.string().required(),
  nameVi: joi.string().max(256).allow(null, ''),
  acronym: joi.string().max(256).allow(null, ''),
  typeProduct: joi.string().allow(null, ''),
  purposeUse: joi.string().allow(null, ''),
  description: joi.string().allow(null, ''),
  uses: joi.string().allow(null, ''),
  element: joi.string().allow(null, ''),
  guide: joi.string().allow(null, ''),
  outstanding: joi.number().required(),
  expiry: joi.string().allow(null, ''),
  policy: joi.string().allow(null, ''),
  mainImage: joi.string().required(),
  subImage: joi.array().allow(null, ''),
  productDetail: joi.array().required()
}), validatorType.BODY);

export const changeStatusProductValidator = validator(joi.object().keys({
  id: joi.number().required(),
  status: joi.number().required()
}), validatorType.BODY);
